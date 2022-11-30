<?php

//1. For each item from invoice, query if the name exists in quickbooks (Use firebase ID for name)
// If exists, continue
// If not, add new item
//2. Add Invoice using array of list IDs

require "./addinvoice.php";
global $_conn;

class W4SoapServer
{
    public function sendRequestXML($ticket, $strHCPResponse, $strCompanyFileName, $qbXMLCountry, $qbXMLMajorVers, $qbXMLMinorVers)
    {
        global $_conn;
        $data = mysqli_query($_conn, "select user from TaxCodesSent where user='" . $ticket . "';");
        $assoc = $data->fetch_assoc();
        if ($assoc == null) { //Haven't verified yet that quickbooks has the right tax code
            global $addsalestax_xml;
            error_log("Return|" . $addsalestax_xml);
            return $addsalestax_xml;
        }

        $data = mysqli_query($_conn, "select xml from " . $ticket . ";");
        $assoc = $data->fetch_assoc();
        if ($assoc != null) {
            foreach ($assoc as $key => $value) {
                $xml = new SimpleXMLElement($value); //$value is XML string in database
                $itemNull = false;
                $inc = 1;
                while (!$itemNull) {
                    $invoice = false;
                    $item = $xml->xpath("/QBXML/QBXMLMsgsRq/SalesReceiptAddRq/SalesReceiptAdd/SalesReceiptLineAdd[" . $inc . "]/ItemRef/FullName");
                    if ($item == null) {
                        $item = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/InvoiceLineAdd[" . $inc . "]/ItemRef/FullName");
                        if ($item != null)
                            $invoice = true;
                    }

                    if ($invoice) { //Need to add customer to quickbooks if they don't exist
                        $customer = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/CustomerRef/FullName");
                        if ($customer != null) {
                            $data2 = mysqli_query($_conn, "select name from FullNames where user='" . $ticket . "' and name='" . $customer[0] . "';"); //Temporary table that stores all fullnames of items that are verified to be in QuickBooks
                            if ($data2->fetch_assoc() == null) {
                                global $addcustomer_xml;
                                $request = $addcustomer_xml;
                                $request = str_replace("W4CUSTOMER", $customer[0], $request);
                                $addr1 = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/BillAddress/Addr1");
                                $city = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/BillAddress/City");
                                $state = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/BillAddress/State");
                                $postalcode = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/BillAddress/PostalCode");
                                $country = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/BillAddress/Country");
                                $phone = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/FOB");
                                $email = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/Memo");
                                if ($addr1 != null)
                                    $request = str_replace("W4ADDR1", $addr1[0], $request);
                                if ($city != null)
                                    $request = str_replace("W4CITY", $city[0], $request);
                                if ($state != null)
                                    $request = str_replace("W4STATE", $state[0], $request);
                                if ($postalcode != null)
                                    $request = str_replace("W4POSTALCODE", $postalcode[0], $request);
                                if ($country != null)
                                    $request = str_replace("W4COUNTRY", $country[0], $request);
                                if ($phone != null)
                                    $request = str_replace("W4PHONE", $phone[0], $request);
                                if ($email != null)
                                    $request = str_replace("W4EMAIL", $email[0], $request);

                                mysqli_query($_conn, "insert into FullNames Values('" . $ticket . "','" . $customer[0] . "');");
                                error_log("Return|" . $request);
                                return $request;
                            }
                        }
                    }

                    $itemNull = $item == null;
                    if (!$itemNull) {
                        $data2 = mysqli_query($_conn, "select name from FullNames where user='" . $ticket . "' and name='" . $item[0] . "';"); //Temporary table that stores all fullnames of items that are verified to be in QuickBooks
                        $matchFound = $data2->fetch_assoc() != null;
                        if (!$matchFound) //Need to add to quickbooks, fails adding if already added
                        {
                            if ($invoice)
                                $desc = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/InvoiceLineAdd[" . $inc . "]/Desc");
                            else
                                $desc = $xml->xpath("/QBXML/QBXMLMsgsRq/SalesReceiptAddRq/SalesReceiptAdd/SalesReceiptLineAdd[" . $inc . "]/Desc");
                            if ($desc == null)
                                $desc = "";
                            else
                                $desc = $desc[0];

                            $desc2 = $desc;
                            if (strlen($desc2) > 31)
                                $desc2 = substr($desc2, 0, 31);

                            if ($invoice)
                                $qty = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/InvoiceLineAdd[" . $inc . "]/Other1");
                            else
                                $qty = $xml->xpath("/QBXML/QBXMLMsgsRq/SalesReceiptAddRq/SalesReceiptAdd/SalesReceiptLineAdd[" . $inc . "]/Other1");
                            if ($qty == null)
                                $qty = "0";
                            else
                                $qty = $qty[0];

                            if ($invoice)
                                $reg = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/InvoiceLineAdd[" . $inc . "]/Other2");
                            else
                                $reg = $xml->xpath("/QBXML/QBXMLMsgsRq/SalesReceiptAddRq/SalesReceiptAdd/SalesReceiptLineAdd[" . $inc . "]/Other2");
                            if ($reg == null)
                                $reg = "0";
                            else
                                $reg = $reg[0];

                            if ($invoice)
                                $amount = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/InvoiceLineAdd[" . $inc . "]/Amount");
                            else
                                $amount = $xml->xpath("/QBXML/QBXMLMsgsRq/SalesReceiptAddRq/SalesReceiptAdd/SalesReceiptLineAdd[" . $inc . "]/Amount");

                            if ($invoice)
                                $quantity = $xml->xpath("/QBXML/QBXMLMsgsRq/InvoiceAddRq/InvoiceAdd/InvoiceLineAdd[" . $inc . "]/Quantity");
                            else
                                $quantity = $xml->xpath("/QBXML/QBXMLMsgsRq/SalesReceiptAddRq/SalesReceiptAdd/SalesReceiptLineAdd[" . $inc . "]/Quantity");

                            $salesprice = "0";
                            if ($quantity != null && $amount != null) {
                                $q = (int)$quantity[0];
                                $a = (float)$amount[0];
                                if ($q != 0)
                                    $salesprice = $a / $q;
                            }

                            global $additem_xml;
                            $request = $additem_xml;
                            $request = str_replace("W4Name", $item[0], $request);
                            $request = str_replace("W4ManufacturerPartNumber", $desc2, $request);
                            $request = str_replace("W4SalesDesc", $desc, $request);
                            $request = str_replace("W4SalesPrice", $salesprice, $request);
                            $request = str_replace("W4PurchaseCost", $reg, $request);
                            $request = str_replace("W4ReorderPoint", "0", $request);
                            $request = str_replace("W4QuantityOnHand", $qty, $request);

                            mysqli_query($_conn, "insert into FullNames Values('" . $ticket . "','" . $item[0] . "');");
                            error_log("Return|" . $request);
                            return $request;
                        }
                    }
                    ++$inc;
                }

                $value2 = str_replace("'", "\'", $value);
                mysqli_query(
                    $_conn,
                    'update ' . $ticket . ' ' .
                        'set sent=\'1\' ' .
                        'where xml=\'' . $value2 . '\''
                );

                error_log("Return|" . $value);
                return $value;
            }
        }
    }

    public function serverVersion()
    {
        return "1";
    }

    public function clientVersion()
    {
        return "";
    }

    public function authenticate($user, $pass)
    {
        global $_conn;
        $data = mysqli_query($_conn, "select password from users where user = '" . $user . "';");
        $assoc = $data->fetch_assoc();
        if ($assoc != null)
            foreach ($assoc as $key => $value) {
                if ($value == $pass)
                    return array($user, "");
            }
        return null;
    }

    public function connectionError($ticket, $hresult, $message)
    {
        error_log("Ticket1|" . $ticket);
        error_log("HResult1|" . $hresult);
        error_log("Message1|" . $message);
    }

    public function closeConnection($ticket)
    {
        global $_conn;
        mysqli_query($_conn, "delete from " . $ticket . ";");
        mysqli_query($_conn, "delete from FullNames where user='" . $ticket . "';");
        mysqli_query($_conn, "delete from TaxCodesSent where user='" . $ticket . "';");
        error_log("Closed Connection");
        return "Finished";
    }

    public function getLastError($ticket)
    {
        return "";
    }

    public function receiveResponseXML($ticket, $response, $hresult, $message)
    {
        global $_conn;

        error_log("RESPONSE|" . $response);
        error_log("MESSAGE|" . $message);
        $xml = new SimpleXMLElement($response);

        $path = $xml->xpath("/QBXML/QBXMLMsgsRs/ItemSalesTaxAddRs");
        if ($path != null) {
            mysqli_query($_conn, 'insert into TaxCodesSent values("' . $ticket . '");');
            error_log("Return 25");
            return 25;
        }
        $path = $xml->xpath("/QBXML/QBXMLMsgsRs/CustomerAddRs");
        if ($path != null) {
            error_log("Return 30");
            return 30;
        }

        $path = $xml->xpath("/QBXML/QBXMLMsgsRs/ItemInventoryAddRs");
        //0 = OK
        //3100 = The name of the list element is already in use.

        if ($path != null) {
            error_log("Return 50 (1)");
            return 50;
        } else {
            mysqli_query(
                $_conn,
                'delete from ' . $ticket .
                    ' where sent="1";'
            );

            $data = mysqli_query($_conn, "select xml from " . $ticket . ";");
            if ($data->fetch_assoc() == null) {
                error_log("Return 100");
                return 100;
            }
            error_log("Return 50 (2)");
            return 50;
        }
        //Percentage completion to be sent, 100 when finished, calls sendRequestXML if less than 100
    }
}
$options = ['uri' => 'https://cleanassistant.net/partscouter_server/'];
$server = new SoapServer(null, $options);
$server->setClass('W4SoapServer');
$server->handle();
