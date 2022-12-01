<?php
// create table TaxCodesSent (
//         user varchar(255)
//         );

// create table FullNames (
//         user varchar(255),
//         name varchar(255)
//         );

// create table DeF3dJk1QGbO10YeyvPniNSzafd2 (
//         sent char(1),
//         xml text(16383)
//         );

// INSERT INTO
// DeF3dJk1QGbO10YeyvPniNSzafd2
// (
//     sent,
//     xml 
// ) VALUES (
//     "0",
// "text"
// );

// update DeF3dJk1QGbO10YeyvPniNSzafd2
// set sent="1"
// where xml="text";

// delete from DeF3dJk1QGbO10YeyvPniNSzafd2 
// where sent="1";
$_conn = new mysqli("invoice1.cq8acylc5ez7.us-west-2.rds.amazonaws.com", "root", "%bigDatabasePassword%", "invoice", 3306);

$addsalestax_xml = '<?xml version="1.0" encoding="utf-8"?>
<?qbxml version="16.0"?>
<QBXML>
        <QBXMLMsgsRq onError="stopOnError">
                <ItemSalesTaxAddRq>
                        <ItemSalesTaxAdd>
                                <Name>PartscouterTax</Name> 
                        </ItemSalesTaxAdd>
                </ItemSalesTaxAddRq>
        </QBXMLMsgsRq>
</QBXML>';

$additem_xml =
        '<?xml version="1.0" encoding="utf-8"?>' .
        '<?qbxml version="15.0"?>' .
        '<QBXML>' .
        '        <QBXMLMsgsRq onError="stopOnError">' .
        '                <ItemInventoryAddRq>' .
        '                        <ItemInventoryAdd> <!-- required -->' .
        '                                <Name >W4Name</Name> <!-- required -->' .
        '                                <ManufacturerPartNumber >W4ManufacturerPartNumber</ManufacturerPartNumber> ' .
        '                                <SalesDesc>W4SalesDesc</SalesDesc>' .
        '                                <SalesPrice >W4SalesPrice</SalesPrice> ' .
        '                                <IncomeAccountRef> ' .
        '                                       <FullName>Inventory Asset</FullName> ' .
        '                                </IncomeAccountRef>' .
        '                                <PurchaseCost>W4PurchaseCost</PurchaseCost> ' .
        '                                <COGSAccountRef> ' .
        '                                       <FullName >Cost of Goods Sold</FullName> ' .
        '                                </COGSAccountRef>' .
        '                                <AssetAccountRef> ' .
        '                                       <FullName >Inventory Asset</FullName> ' .
        '                                </AssetAccountRef>' .
        '                                <ReorderPoint >W4ReorderPoint</ReorderPoint> ' .
        '                                <QuantityOnHand >W4QuantityOnHand</QuantityOnHand> ' .
        '                        </ItemInventoryAdd>' .
        '                </ItemInventoryAddRq>' .
        '        </QBXMLMsgsRq>' .
        '</QBXML>';

$addcustomer_xml =
        '<?xml version="1.0" encoding="utf-8"?>
        <?qbxml version="16.0"?>
        <QBXML>
                <QBXMLMsgsRq onError="stopOnError">
                        <CustomerAddRq>
                                <CustomerAdd>
                                        <Name>W4CUSTOMER</Name>
                                        <BillAddress>
                                        <Addr1>W4ADDR1</Addr1>
                                        <City>W4CITY</City>
                                        <State>W4STATE</State>
                                        <PostalCode>W4POSTALCODE</PostalCode>
                                        <Country>W4COUNTRY</Country>
                                        </BillAddress>
                                        <Phone>W4PHONE</Phone>
                                        <Email>W4EMAIL</Email>
                                </CustomerAdd>
                        </CustomerAddRq>
                </QBXMLMsgsRq>
        </QBXML>';
