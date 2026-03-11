// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getDatabase, get as dbGet, ref as dbRef, onValue as dbOnValue, off as dbOff, remove as dbRemove, set as dbSet, push as dbPush } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Firebase config (same as index.js)
const firebaseConfig = {
	apiKey: "AIzaSyC2HKsO-TrReCH-tC3ATDozuQzaPjIqR0g",
	authDomain: "jeremymusic-c117d.firebaseapp.com",
	projectId: "jeremymusic-c117d",
	storageBucket: "jeremymusic-c117d.firebasestorage.app",
	messagingSenderId: "103099955855",
	appId: "1:103099955855:web:c1bc1a4a36c604945b8efa",
	measurementId: "G-4QEVLNKMVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
let subscribersRef = null;
let subscribersListener = null;
let testimonialsRef = null;
let testimonialsListener = null;
let contentRef = null;
let contentListener = null;
let aboutShortRef = null;
let aboutShortListener = null;
let aboutLongRef = null;
let aboutLongListener = null;
let performancesRef = null;
let performancesListener = null;
let newAlbumRef = null;
let newAlbumListener = null;
let youtubeRef = null;
let youtubeListener = null;
let youtubeListRef = null;
let youtubeListListener = null;
let imagesRef = null;
let imagesListener = null; 
let lyricsRef = null;
let lyricsListener = null; 
let epkBioRef = null;
let epkBioListener = null;
let epkYoutubeListRef = null;
let epkYoutubeListListener = null;
let epkTourRef = null;
let epkTourListener = null;
let epkAccoladesRef = null;
let epkAccoladesListener = null;
let epkPressClippingsRef = null;
let epkPressClippingsListener = null;
let epkCoverRef = null;
let epkCoverListener = null;
let epkAssetTextRef = null;
let epkAssetTextListener = null;
let epkAssetImagesRef = null;
let epkAssetImagesListener = null;
let epkImagesRef = null;
let epkImagesListener = null; 

// Login form handler and auth state listener
document.addEventListener('DOMContentLoaded', () => {
	const loginContainer = document.querySelector('.login-container');
	const adminDashboard = document.getElementById('adminDashboard');
	const loginForm = document.getElementById('loginForm');
	const loginError = document.getElementById('loginError');
	const logoutBtn = document.getElementById('logoutBtn');

	// Attach login submit handler if the form exists on the page
	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			if (loginError) loginError.textContent = '';
			const email = document.getElementById('email').value.trim();
			const password = document.getElementById('password').value;
			try {
				await signInWithEmailAndPassword(auth, email, password);
				// No redirect: onAuthStateChanged will toggle the UI
			} catch (err) {
				if (loginError) loginError.textContent = err.message || 'Login failed.';
			}
		});
	}

	// Logout button handler (optional)
	if (logoutBtn) {
		logoutBtn.addEventListener('click', async () => {
			try {
				await signOut(auth);
			} catch (err) {
				console.error('Sign out error:', err);
			}
		});
	}

	// Listen for auth state changes and toggle UI
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// Show admin UI
			if (loginContainer) loginContainer.style.display = 'none';
			if (adminDashboard) adminDashboard.style.display = 'block';

			// Attach realtime listener to /subscribers
			try {
				subscribersRef = dbRef(db, 'subscribers');
				subscribersListener = (snapshot) => {
					const tbody = document.querySelector('#subscribersTable tbody');
					if (!tbody) return;
					tbody.innerHTML = '';
					let subscribersFound = false;
					if (snapshot && snapshot.exists()) {
						snapshot.forEach((childSnap) => {
							const data = childSnap.val() || {};
							const tr = document.createElement('tr');
							const phoneTd = document.createElement('td');
							const emailTd = document.createElement('td');
							const addressTd = document.createElement('td');
							phoneTd.textContent = data.phone || '';
							emailTd.textContent = data.email || '';
							addressTd.textContent = data.address || '';
							tr.appendChild(phoneTd);
							tr.appendChild(emailTd);
							tr.appendChild(addressTd);
							tbody.appendChild(tr);
							subscribersFound = true;
						});
					}

					if (!subscribersFound) {
						const tr = document.createElement('tr');
						const td = document.createElement('td');
						td.setAttribute('colspan', '2');
						td.textContent = 'No subscribers.';
						tr.appendChild(td);
						tbody.appendChild(tr);
					}
				};
				// Start listening
				dbOnValue(subscribersRef, subscribersListener);
			} catch (err) {
				console.error('Failed to attach subscribers listener:', err);
			}

			// Attach realtime listener to /testimonialsPending
			try {
				testimonialsRef = dbRef(db, 'testimonialsPending');
				testimonialsListener = (snapshot) => {
					const tbody = document.querySelector('#testimonialsTable tbody');
					if (!tbody) return;
					tbody.innerHTML = '';
					let testimonialsFound = false;
					if (snapshot && snapshot.exists()) {
						snapshot.forEach((childSnap) => {
							const data = childSnap.val() || {};
							const testimonialId = childSnap.key;
							const tr = document.createElement('tr');
							
							const nameTd = document.createElement('td');
							nameTd.textContent = data.name || '';
							
							const dateTd = document.createElement('td');
							dateTd.textContent = data.date || '';
							
							const commentTd = document.createElement('td');
							commentTd.textContent = data.comment || '';
							
							const actionTd = document.createElement('td');
							const acceptBtn = document.createElement('button');
							acceptBtn.textContent = 'Accept';
							acceptBtn.className = 'btn';
							acceptBtn.style.marginRight = '5px';
							acceptBtn.addEventListener('click', async () => {
								try {
									// Move to testimonials
									await dbSet(dbRef(db, `testimonials/${testimonialId}`), data);
									// Remove from testimonialsPending
									await dbRemove(dbRef(db, `testimonialsPending/${testimonialId}`));
								} catch (err) {
									console.error('Failed to accept testimonial:', err);
									alert('Failed to accept testimonial');
								}
							});
							
							const rejectBtn = document.createElement('button');
							rejectBtn.textContent = 'Reject';
							rejectBtn.className = 'btn';
							rejectBtn.style.backgroundColor = '#d9534f';
							rejectBtn.addEventListener('click', async () => {
								try {
									// Remove from testimonialsPending
									await dbRemove(dbRef(db, `testimonialsPending/${testimonialId}`));
								} catch (err) {
									console.error('Failed to reject testimonial:', err);
									alert('Failed to reject testimonial');
								}
							});
							
							actionTd.appendChild(acceptBtn);
							actionTd.appendChild(rejectBtn);
							
							tr.appendChild(nameTd);
							tr.appendChild(dateTd);
							tr.appendChild(commentTd);
							tr.appendChild(actionTd);
							tbody.appendChild(tr);
							testimonialsFound = true;
						});
					}

					if (!testimonialsFound) {
						const tr = document.createElement('tr');
						const td = document.createElement('td');
						td.setAttribute('colspan', '4');
						td.textContent = 'No pending testimonials.';
						tr.appendChild(td);
						tbody.appendChild(tr);
					}
				};
				// Start listening
				dbOnValue(testimonialsRef, testimonialsListener);
			} catch (err) {
				console.error('Failed to attach testimonials listener:', err);
			}

				// Attach listeners for short and extended About Me and wire up save buttons
				try {
					aboutShortRef = dbRef(db, 'content/aboutme_short');
					aboutLongRef = dbRef(db, 'content/aboutme_long');

					// Short About Me listener
					contentRef = aboutShortRef;
					contentListener = (snapshot) => {
						const textarea = document.getElementById('aboutShortInput');
						if (!textarea) return;
						textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
						const status = document.getElementById('aboutShortSaveStatus');
						if (status) status.style.display = 'none';
					};
					dbOnValue(aboutShortRef, contentListener);

					// Long About Me listener
					aboutLongListener = (snapshot) => {
						const textarea = document.getElementById('aboutLongInput');
						if (!textarea) return;
						textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
						const status = document.getElementById('aboutLongSaveStatus');
						if (status) status.style.display = 'none';
					};
					dbOnValue(aboutLongRef, aboutLongListener);

					// Save short handler
					const saveShortBtn = document.getElementById('saveAboutShortBtn');
					if (saveShortBtn) {
						saveShortBtn.addEventListener('click', async () => {
							const textarea = document.getElementById('aboutShortInput');
							const status = document.getElementById('aboutShortSaveStatus');
							if (!textarea) return;
							try {
								if (status) { status.style.display = 'none'; }
								await dbSet(aboutShortRef, textarea.value || '');
								if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
							} catch (err) {
								console.error('Failed to save short About Me:', err);
								alert('Failed to save About Me.');
							}
						});
					}

					// Save long handler
					const saveLongBtn = document.getElementById('saveAboutLongBtn');
					if (saveLongBtn) {
						saveLongBtn.addEventListener('click', async () => {
							const textarea = document.getElementById('aboutLongInput');
							const status = document.getElementById('aboutLongSaveStatus');
							if (!textarea) return;
							try {
								if (status) { status.style.display = 'none'; }
								await dbSet(aboutLongRef, textarea.value || '');
								if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
							} catch (err) {
								console.error('Failed to save extended About Me:', err);
								alert('Failed to save About Me.');
							}
						});
					}
				} catch (err) {
					console.error('Failed to attach content/aboutme_short or aboutme_long listeners:', err);
				}

				// Attach listener for content/performances and wire up save button
				try {
					performancesRef = dbRef(db, 'content/performances');
					performancesListener = (snapshot) => {
						const textarea = document.getElementById('performancesInput');
						if (!textarea) return;
						textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
						const status = document.getElementById('performancesSaveStatus');
						if (status) status.style.display = 'none';
					};
					dbOnValue(performancesRef, performancesListener);

					const savePerfBtn = document.getElementById('savePerformancesBtn');
					if (savePerfBtn) {
						savePerfBtn.addEventListener('click', async () => {
							const textarea = document.getElementById('performancesInput');
							const status = document.getElementById('performancesSaveStatus');
							if (!textarea) return;
							try {
								if (status) { status.style.display = 'none'; }
								await dbSet(dbRef(db, 'content/performances'), textarea.value || '');
								if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
							} catch (err) {
								console.error('Failed to save performances:', err);
								alert('Failed to save performances.');
							}
						});
					}
				} catch (err) {
					console.error('Failed to attach content/performances listener:', err);
				}

				// Attach listener for content/newalbum and wire up save button
				try {
					newAlbumRef = dbRef(db, 'content/newalbum');
					newAlbumListener = (snapshot) => {
						const textarea = document.getElementById('newAlbumInput');
						if (!textarea) return;
						textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
						const status = document.getElementById('newAlbumSaveStatus');
						if (status) status.style.display = 'none';
					};
					dbOnValue(newAlbumRef, newAlbumListener);

					const saveNewAlbumBtn = document.getElementById('saveNewAlbumBtn');
					if (saveNewAlbumBtn) {
						saveNewAlbumBtn.addEventListener('click', async () => {
							const textarea = document.getElementById('newAlbumInput');
							const status = document.getElementById('newAlbumSaveStatus');
							if (!textarea) return;
							try {
								if (status) { status.style.display = 'none'; }
								await dbSet(dbRef(db, 'content/newalbum'), textarea.value || '');
								if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
							} catch (err) {
								console.error('Failed to save new album:', err);
								alert('Failed to save new album.');
							}
						});
					}
				} catch (err) {
					console.error('Failed to attach content/newalbum listener:', err);
				}

				// Attach listener for content/youtubeiframe and wire up save button
				try {
					youtubeRef = dbRef(db, 'content/youtubeiframe');
					youtubeListener = (snapshot) => {
						const input = document.getElementById('youtubeInput');
						if (!input) return;
						input.value = snapshot && snapshot.exists() ? snapshot.val() : '';
						const status = document.getElementById('youtubeSaveStatus');
						if (status) status.style.display = 'none';
					};
					dbOnValue(youtubeRef, youtubeListener);

					const saveYoutubeBtn = document.getElementById('saveYoutubeBtn');
					if (saveYoutubeBtn) {
						saveYoutubeBtn.addEventListener('click', async () => {
							const input = document.getElementById('youtubeInput');
							const status = document.getElementById('youtubeSaveStatus');
							if (!input) return;
							const val = (input.value || '').trim();
							// Basic validation: expect an embed URL
							if (val && !/^https:\/\/www\.youtube\.com\/embed\//.test(val)) {
								if (!confirm('The URL does not look like a YouTube embed URL. Save anyway?')) return;
							}
							try {
								if (status) { status.style.display = 'none'; }
								await dbSet(dbRef(db, 'content/youtubeiframe'), val);
								if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
							} catch (err) {
								console.error('Failed to save YouTube URL:', err);
								alert('Failed to save YouTube URL.');
							}
						});
					}
				} catch (err) {
					console.error('Failed to attach content/youtubeiframe listener:', err);
				}

				// Attach listener for content/youtubeiframes (list) and wire up add/delete UI
				try {
					youtubeListRef = dbRef(db, 'content/youtubeiframes');
					youtubeListListener = (snapshot) => {
						const list = document.getElementById('youtubeList');
						if (!list) return;
						list.innerHTML = '';
						if (snapshot && snapshot.exists()) {
							snapshot.forEach((childSnap) => {
								const data = childSnap.val() || {};
								const key = childSnap.key;
								const row = document.createElement('div');
								row.style.display = 'flex';
								row.style.alignItems = 'center';
								row.style.gap = '8px';
								const url = data.url || '';
								// Preview iframe if it's an embed URL, otherwise show the URL text
								const previewDiv = document.createElement('div');
								previewDiv.style.flex = '1';
								if (/^https:\/\/www\.youtube\.com\/embed\//.test(url)) {
									const iframe = document.createElement('iframe');
									iframe.src = url;
									iframe.width = '320';
									iframe.height = '180';
									iframe.frameBorder = '0';
									iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
									iframe.allowFullscreen = true;
									previewDiv.appendChild(iframe);
								} else {
									previewDiv.textContent = url;
								}

								const delBtn = document.createElement('button');
								delBtn.textContent = 'Delete';
								delBtn.className = 'btn';
								delBtn.style.backgroundColor = '#d9534f';
								delBtn.addEventListener('click', async () => {
									if (!confirm('Delete this video?')) return;
									try {
										await dbRemove(dbRef(db, 'content/youtubeiframes/' + key));
									} catch (err) {
										console.error('Failed to delete video:', err);
										alert('Failed to delete video.');
									}
								});

								row.appendChild(previewDiv);
								row.appendChild(delBtn);
								list.appendChild(row);
							});
						} else {
							list.textContent = 'No videos.';
						}
					};
					dbOnValue(youtubeListRef, youtubeListListener);

					const addBtn = document.getElementById('addYoutubeListBtn');
					const listInput = document.getElementById('youtubeListInput');
					const listStatus = document.getElementById('youtubeListStatus');
					if (addBtn && listInput) {
						addBtn.addEventListener('click', async () => {
							const val = (listInput.value || '').trim();
							if (!val) {
								alert('Enter a YouTube embed URL to add.');
								return;
							}
							if (val && !/^https:\/\/www\.youtube\.com\/embed\//.test(val)) {
								if (!confirm('The URL does not look like a YouTube embed URL. Add anyway?')) return;
							}
							try {
								const newRef = dbPush(youtubeListRef);
								await dbSet(newRef, { url: val, timestamp: Date.now() });
								listInput.value = '';
								if (listStatus) { listStatus.style.display = 'inline'; setTimeout(() => { listStatus.style.display = 'none'; }, 1500); }
							} catch (err) {
								console.error('Failed to add video:', err);
								alert('Failed to add video.');
							}
						});
					}
				} catch (err) {
					console.error('Failed to attach content/youtubeiframes listener:', err);
				}

			// Attach listener for content/epk/bio and wire up save button
			try {
				epkBioRef = dbRef(db, 'content/epk/bio');
				epkBioListener = (snapshot) => {
					const textarea = document.getElementById('epkBioInput');
					if (!textarea) return;
					textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
					const status = document.getElementById('epkBioSaveStatus');
					if (status) status.style.display = 'none';
				};
				dbOnValue(epkBioRef, epkBioListener);

				const saveEpkBtn = document.getElementById('saveEpkBioBtn');
				if (saveEpkBtn) {
					saveEpkBtn.addEventListener('click', async () => {
						const textarea = document.getElementById('epkBioInput');
						const status = document.getElementById('epkBioSaveStatus');
						if (!textarea) return;
						try {
							if (status) { status.style.display = 'none'; }
							await dbSet(epkBioRef, textarea.value || '');
							if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
						} catch (err) {
							console.error('Failed to save EPK bio:', err);
							alert('Failed to save EPK bio.');
						}
					});
				}
			} catch (err) {
				console.error('Failed to attach content/epk/bio listener:', err);
			}

			// Attach listener for content/epk/contact and wire up save button
			let epkContactRef = null;
			let epkContactListener = null;
			try {
				epkContactRef = dbRef(db, 'content/epk/contact');
				epkContactListener = (snapshot) => {
					const textarea = document.getElementById('epkContactInput');
					if (!textarea) return;
					textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
					const status = document.getElementById('epkContactSaveStatus');
					if (status) status.style.display = 'none';
				};
				dbOnValue(epkContactRef, epkContactListener);

				const saveEpkContactBtn = document.getElementById('saveEpkContactBtn');
				if (saveEpkContactBtn) {
					saveEpkContactBtn.addEventListener('click', async () => {
						const textarea = document.getElementById('epkContactInput');
						const status = document.getElementById('epkContactSaveStatus');
						if (!textarea) return;
						try {
							if (status) { status.style.display = 'none'; }
							await dbSet(epkContactRef, textarea.value || '');
							if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
						} catch (err) {
							console.error('Failed to save EPK contact:', err);
							alert('Failed to save contact info.');
						}
					});
				}
			} catch (err) {
				console.error('Failed to attach content/epk/contact listener:', err);
			}

						// Attach listener for content/epk/bio and wire up save button
			try {
				epkTourRef = dbRef(db, 'content/epk/tourHistory');
				epkTourListener = (snapshot) => {
					const textarea = document.getElementById('epkTourInput');
					if (!textarea) return;
					textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
					const status = document.getElementById('epkTourSaveStatus');
					if (status) status.style.display = 'none';
				};
				dbOnValue(epkTourRef, epkTourListener);

				const saveEpkBtn = document.getElementById('saveEpkTourBtn');
				if (saveEpkBtn) {
					saveEpkBtn.addEventListener('click', async () => {
						const textarea = document.getElementById('epkTourInput');
						const status = document.getElementById('epkTourSaveStatus');
						if (!textarea) return;
						try {
							if (status) { status.style.display = 'none'; }
							await dbSet(epkTourRef, textarea.value || '');
							if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
						} catch (err) {
							console.error('Failed to save EPK Tour:', err);
							alert('Failed to save EPK Tour.');
						}
					});
				}
			} catch (err) {
				console.error('Failed to attach content/epk/tourHistory listener:', err);
			}

			// Attach listener for content/epk/accolades and wire up save button
			try {
				epkAccoladesRef = dbRef(db, 'content/epk/accolades');
				epkAccoladesListener = (snapshot) => {
					const textarea = document.getElementById('epkAccoladesInput');
					if (!textarea) return;
					textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
					const status = document.getElementById('epkAccoladesSaveStatus');
					if (status) status.style.display = 'none';
				};
				dbOnValue(epkAccoladesRef, epkAccoladesListener);

				const saveEpkAccoladesBtn = document.getElementById('saveEpkAccoladesBtn');
				if (saveEpkAccoladesBtn) {
					saveEpkAccoladesBtn.addEventListener('click', async () => {
						const textarea = document.getElementById('epkAccoladesInput');
						const status = document.getElementById('epkAccoladesSaveStatus');
						if (!textarea) return;
						try {
							if (status) { status.style.display = 'none'; }
							await dbSet(epkAccoladesRef, textarea.value || '');
							if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
						} catch (err) {
							console.error('Failed to save EPK accolades:', err);
							alert('Failed to save EPK accolades.');
						}
					});
				}
			} catch (err) {
				console.error('Failed to attach content/epk/accolades listener:', err);
			}

			// Attach listener for content/epk/pressClippings and wire up save button
			try {
				epkPressClippingsRef = dbRef(db, 'content/epk/pressClippings');
				epkPressClippingsListener = (snapshot) => {
					const textarea = document.getElementById('epkPressClippingsInput');
					if (!textarea) return;
					textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
					const status = document.getElementById('epkPressClippingsSaveStatus');
					if (status) status.style.display = 'none';
				};
				dbOnValue(epkPressClippingsRef, epkPressClippingsListener);

				const saveEpkPressClippingsBtn = document.getElementById('saveEpkPressClippingsBtn');
				if (saveEpkPressClippingsBtn) {
					saveEpkPressClippingsBtn.addEventListener('click', async () => {
						const textarea = document.getElementById('epkPressClippingsInput');
						const status = document.getElementById('epkPressClippingsSaveStatus');
						if (!textarea) return;
						try {
							if (status) { status.style.display = 'none'; }
							await dbSet(epkPressClippingsRef, textarea.value || '');
							if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
						} catch (err) {
							console.error('Failed to save EPK press clippings:', err);
							alert('Failed to save EPK press clippings.');
						}
					});
				}
			} catch (err) {
				console.error('Failed to attach content/epk/pressClippings listener:', err);
			}

			// Attach listener for content/epk/coverImage and wire up single-cover upload
			try {
				epkCoverRef = dbRef(db, 'content/epk/coverImage');
				epkCoverListener = (snapshot) => {
					const preview = document.getElementById('epkCoverPreview');
					if (!preview) return;
					preview.innerHTML = '';
					if (snapshot && snapshot.exists()) {
						const data = snapshot.val() || {};
						if (data.data) {
							const img = document.createElement('img');
							img.src = data.data;
							img.alt = data.name || 'EPK cover';
							img.style.width = '100%';
							img.style.maxWidth = '360px';
							img.style.height = 'auto';
							img.style.objectFit = 'cover';
							preview.appendChild(img);
						} else if (typeof snapshot.val() === 'string') {
							const img = document.createElement('img');
							img.src = snapshot.val();
							img.style.width = '100%';
							img.style.maxWidth = '360px';
							preview.appendChild(img);
						}
					} else {
						preview.textContent = 'No cover image.';
					}
					const status = document.getElementById('epkCoverUploadStatus');
					if (status) status.style.display = 'none';
				};
				dbOnValue(epkCoverRef, epkCoverListener);

				const uploadBtn = document.getElementById('uploadEpkCoverBtn');
				const fileInput = document.getElementById('epkCoverFileInput');
				if (uploadBtn && fileInput) {
					uploadBtn.addEventListener('click', async () => {
						const files = fileInput.files;
						if (!files || files.length === 0) {
							alert('Please select an image to upload.');
							return;
						}
						const file = files[0];
						const reader = new FileReader();
						try {
							await new Promise((resolve, reject) => {
								reader.onload = async (e) => {
									try {
										const dataUrl = e.target.result;
										await dbSet(epkCoverRef, { name: file.name, data: dataUrl, timestamp: Date.now() });
										resolve();
									} catch (err) {
										reject(err);
									}
								};
								reader.onerror = () => reject(new Error('File read error'));
								reader.readAsDataURL(file);
							});
							fileInput.value = '';
							const status = document.getElementById('epkCoverUploadStatus');
							if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 1500); }
						} catch (err) {
							console.error('Failed to upload EPK cover image:', err);
							alert('Failed to upload cover image.');
						}
					});
				}
			} catch (err) {
				console.error('Failed to attach content/epk/coverImage listener:', err);
			}

			// Attach listener for content/lyrics and wire up add/delete UI
			try {
				lyricsRef = dbRef(db, 'content/lyrics');
				lyricsListener = (snapshot) => {
					const list = document.getElementById('lyricsList');
					if (!list) return;
					list.innerHTML = '';
					if (snapshot && snapshot.exists()) {
						snapshot.forEach((childSnap) => {
							const data = childSnap.val() || {};
							const key = childSnap.key;
							const row = document.createElement('div');
							row.style.display = 'flex';
							row.style.alignItems = 'center';
							row.style.gap = '8px';
							const infoDiv = document.createElement('div');
							infoDiv.style.flex = '1';
							const title = data.title || '';
							const contentPreview = (data.content || '').replace(/\n/g, ' ').slice(0,200);
							infoDiv.textContent = title + (contentPreview ? ' — ' + contentPreview : '');
							const delBtn = document.createElement('button');
							delBtn.textContent = 'Delete';
							delBtn.className = 'btn';
							delBtn.style.backgroundColor = '#d9534f';
							delBtn.addEventListener('click', async () => {
								if (!confirm('Delete this lyric?')) return;
								try {
									await dbRemove(dbRef(db, 'content/lyrics/' + key));
								} catch (err) {
									console.error('Failed to delete lyric:', err);
									alert('Failed to delete lyric.');
								}
							});
							row.appendChild(infoDiv);
							row.appendChild(delBtn);
							list.appendChild(row);
						});
					} else {
						list.textContent = 'No lyrics.';
					}
				};
				dbOnValue(lyricsRef, lyricsListener);

				// Add lyric handler
				const addLyricBtn = document.getElementById('addLyricBtn');
				const lyricTitleInput = document.getElementById('lyricTitleInput');
				const lyricContentInput = document.getElementById('lyricContentInput');
				const lyricSaveStatus = document.getElementById('lyricSaveStatus');
				if (addLyricBtn && lyricTitleInput && lyricContentInput) {
					addLyricBtn.addEventListener('click', async () => {
						const title = (lyricTitleInput.value || '').trim();
						const content = (lyricContentInput.value || '').trim();
						if (!title && !content) {
							alert('Please enter a title or lyric content.');
							return;
						}
						try {
							if (lyricSaveStatus) { lyricSaveStatus.style.display = 'none'; }
							const newRef = dbPush(lyricsRef);
							await dbSet(newRef, { title, content, ts: Date.now() });
							lyricTitleInput.value = '';
							lyricContentInput.value = '';
							if (lyricSaveStatus) { lyricSaveStatus.style.display = 'inline'; setTimeout(() => { lyricSaveStatus.style.display = 'none'; }, 1500); }
						} catch (err) {
							console.error('Failed to add lyric:', err);
							alert('Failed to add lyric.');
						}
					});
				}
			} catch (err) {
				console.error('Failed to attach content/lyrics listener:', err);
			}

			// Attach listener for content/images and wire up upload/delete UI (with ordering)
			try {
				imagesRef = dbRef(db, 'content/images');

				// Helper to swap order values between items
				async function swapImageOrder(targetKey, index, delta) {
					try {
						const snap = await dbGet(imagesRef);
						if (!snap || !snap.exists()) return;
						const arr = [];
						snap.forEach((c) => { arr.push({ key: c.key, data: c.val() || {} }); });
						arr.sort((a, b) => {
							const oa = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
							const ob = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
							return oa - ob;
						});
						const currentIdx = arr.findIndex(i => i.key === targetKey);
						console.log("Swapping", currentIdx);
						if (currentIdx === -1) return;
						const otherIdx = currentIdx + delta;
						if (otherIdx < 0 || otherIdx >= arr.length) return;
						const a = arr[currentIdx];
						const b = arr[otherIdx];
						const orderA = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
						const orderB = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
						// Swap the order values
						await Promise.all([
							dbSet(dbRef(db, 'content/images/' + a.key + '/order'), orderB),
							dbSet(dbRef(db, 'content/images/' + b.key + '/order'), orderA)
						]);
					} catch (err) {
						console.error('Failed to swap image order:', err);
						alert('Failed to reorder images.');
					}
				}

				imagesListener = (snapshot) => {
					const list = document.getElementById('imagesList');
					if (!list) return;
					list.innerHTML = '';
					if (snapshot && snapshot.exists()) {
						// Collect into array and sort by 'order' (fallback to timestamp)
						const items = [];
						snapshot.forEach((childSnap) => {
							items.push({ key: childSnap.key, data: childSnap.val() || {} });
						});
						items.sort((a, b) => {
							const oa = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
							const ob = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
							return oa - ob;
						});
						items.forEach((item, idx) => {
							const data = item.data || {};
							const key = item.key;
							const row = document.createElement('div');
							row.style.display = 'flex';
							row.style.alignItems = 'center';
							row.style.gap = '8px';
							const img = document.createElement('img');
							img.src = data.data || '';
							img.alt = data.name || '';
							img.style.width = '120px';
							img.style.height = 'auto';
							img.style.objectFit = 'cover';
							const nameDiv = document.createElement('div');
							nameDiv.textContent = data.name || '';
							nameDiv.style.flex = '1';
							// Up / Down buttons
							const controlsDiv = document.createElement('div');
							controlsDiv.style.display = 'flex';
							controlsDiv.style.flexDirection = 'column';
							controlsDiv.style.gap = '4px';
							const upBtn = document.createElement('button');
							upBtn.textContent = '▲';
							upBtn.title = 'Move up';
							upBtn.className = 'btn';
							upBtn.disabled = (idx === 0);
							upBtn.addEventListener('click', async () => { await swapImageOrder(key, idx, -1); });
							const downBtn = document.createElement('button');
							downBtn.textContent = '▼';
							downBtn.title = 'Move down';
							downBtn.className = 'btn';
							downBtn.disabled = (idx === items.length - 1);
							downBtn.addEventListener('click', async () => { await swapImageOrder(key, idx, 1); });
							controlsDiv.appendChild(upBtn);
							controlsDiv.appendChild(downBtn);
							const delBtn = document.createElement('button');
							delBtn.textContent = 'Delete';
							delBtn.className = 'btn';
							delBtn.style.backgroundColor = '#d9534f';
							delBtn.addEventListener('click', async () => {
								if (!confirm('Delete this image?')) return;
								try {
									await dbRemove(dbRef(db, 'content/images/' + key));
								} catch (err) {
									console.error('Failed to delete image:', err);
									alert('Failed to delete image.');
								}
							});
							row.appendChild(img);
							row.appendChild(nameDiv);
							row.appendChild(controlsDiv);
							row.appendChild(delBtn);
							list.appendChild(row);
						});
					} else {
						list.textContent = 'No images.';
					}
				};
				dbOnValue(imagesRef, imagesListener);

				// Upload handler (set order so new items go to end)
				const uploadBtn = document.getElementById('uploadImageBtn');
				const fileInput = document.getElementById('imageFileInput');
				if (uploadBtn && fileInput) {
					uploadBtn.addEventListener('click', async () => {
						const files = fileInput.files;
						if (!files || files.length === 0) {
							alert('Please select one or more images to upload.');
							return;
						}
						for (let i = 0; i < files.length; i++) {
							const file = files[i];
							const reader = new FileReader();
							await new Promise((resolve, reject) => {
								reader.onload = async (e) => {
									try {
										const dataUrl = e.target.result;
										const newRef = dbPush(imagesRef);
										// assign an 'order' to place at end (use timestamp)
										await dbSet(newRef, { name: file.name, data: dataUrl, timestamp: Date.now(), order: Date.now() });
										resolve();
									} catch (err) {
										reject(err);
									}
								};
								reader.onerror = () => reject(new Error('File read error'));
								reader.readAsDataURL(file);
							});
						}
						fileInput.value = '';
						const status = document.getElementById('imageUploadStatus');
						if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 1500); }
					});
				}
			} catch (err) {
				console.error('Failed to attach images listener:', err);
			}

// Attach listener for content/epk/images and wire up upload/delete UI (with ordering)
		try {
			epkImagesRef = dbRef(db, 'content/epk/images');

			// Helper to swap order values between EPK items
			async function swapEpkImageOrder(targetKey, index, delta) {
				try {
					const snap = await dbGet(epkImagesRef);
					if (!snap || !snap.exists()) return;
					const arr = [];
					snap.forEach((c) => { arr.push({ key: c.key, data: c.val() || {} }); });
					arr.sort((a, b) => {
						const oa = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
						const ob = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
						return oa - ob;
					});
					const currentIdx = arr.findIndex(i => i.key === targetKey);
					if (currentIdx === -1) return;
					const otherIdx = currentIdx + delta;
					if (otherIdx < 0 || otherIdx >= arr.length) return;
					const a = arr[currentIdx];
					const b = arr[otherIdx];
					const orderA = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
					const orderB = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
					// Swap the order values
					await Promise.all([
						dbSet(dbRef(db, 'content/epk/images/' + a.key + '/order'), orderB),
						dbSet(dbRef(db, 'content/epk/images/' + b.key + '/order'), orderA)
					]);
				} catch (err) {
					console.error('Failed to swap EPK image order:', err);
					alert('Failed to reorder images.');
				}
			}

			epkImagesListener = (snapshot) => {
				const list = document.getElementById('epkImagesList');
				if (!list) return;
				list.innerHTML = '';
				if (snapshot && snapshot.exists()) {
					// Collect into array and sort by 'order' (fallback to timestamp)
					const items = [];
					snapshot.forEach((childSnap) => {
						items.push({ key: childSnap.key, data: childSnap.val() || {} });
					});
					items.sort((a, b) => {
						const oa = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
						const ob = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
						return oa - ob;
					});
					items.forEach((item, idx) => {
						const data = item.data || {};
						const key = item.key;
						const row = document.createElement('div');
						row.style.display = 'flex';
						row.style.alignItems = 'center';
						row.style.gap = '8px';
						const img = document.createElement('img');
						img.src = data.data || '';
						img.alt = data.name || '';
						img.style.width = '120px';
						img.style.height = 'auto';
						img.style.objectFit = 'cover';
						const nameDiv = document.createElement('div');
						nameDiv.textContent = data.name || '';
						nameDiv.style.flex = '1';
						// Up / Down buttons
						const controlsDiv = document.createElement('div');
						controlsDiv.style.display = 'flex';
						controlsDiv.style.flexDirection = 'column';
						controlsDiv.style.gap = '4px';
						const upBtn = document.createElement('button');
						upBtn.textContent = '▲';
						upBtn.title = 'Move up';
						upBtn.className = 'btn';
						upBtn.disabled = (idx === 0);
						upBtn.addEventListener('click', async () => { await swapEpkImageOrder(key, idx, -1); });
						const downBtn = document.createElement('button');
						downBtn.textContent = '▼';
						downBtn.title = 'Move down';
						downBtn.className = 'btn';
						downBtn.disabled = (idx === items.length - 1);
						downBtn.addEventListener('click', async () => { await swapEpkImageOrder(key, idx, 1); });
						controlsDiv.appendChild(upBtn);
						controlsDiv.appendChild(downBtn);
						const delBtn = document.createElement('button');
						delBtn.textContent = 'Delete';
						delBtn.className = 'btn';
						delBtn.style.backgroundColor = '#d9534f';
						delBtn.addEventListener('click', async () => {
							if (!confirm('Delete this image?')) return;
							try {
								await dbRemove(dbRef(db, 'content/epk/images/' + key));
							} catch (err) {
								console.error('Failed to delete image:', err);
								alert('Failed to delete image.');
							}
						});
						row.appendChild(img);
						row.appendChild(nameDiv);
						row.appendChild(controlsDiv);
						row.appendChild(delBtn);
						list.appendChild(row);
					});
				} else {
					list.textContent = 'No images.';
				}
			};
			dbOnValue(epkImagesRef, epkImagesListener);

			// Upload handler (set order so new items go to end)
			const uploadBtn = document.getElementById('uploadEPKImageBtn');
			const fileInput = document.getElementById('epkImageFileInput');
			if (uploadBtn && fileInput) {
				uploadBtn.addEventListener('click', async () => {
					const files = fileInput.files;
					if (!files || files.length === 0) {
						alert('Please select one or more images to upload.');
						return;
					}
					for (let i = 0; i < files.length; i++) {
						const file = files[i];
						const reader = new FileReader();
						await new Promise((resolve, reject) => {
							reader.onload = async (e) => {
								try {
									const dataUrl = e.target.result;
									const newRef = dbPush(epkImagesRef);
									// assign an 'order' to place at end (use timestamp)
									await dbSet(newRef, { name: file.name, data: dataUrl, timestamp: Date.now(), order: Date.now() });
									resolve();
								} catch (err) {
									reject(err);
								}
							};
							reader.onerror = () => reject(new Error('File read error'));
							reader.readAsDataURL(file);
						});
					}
					fileInput.value = '';
					const status = document.getElementById('epkImageUploadStatus');
					if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 1500); }
				});
			}
		} catch (err) {
			console.error('Failed to attach epk images listener:', err);
		}

									// Attach listener for content/youtubeiframes (list) and wire up add/delete UI
				try {
					epkYoutubeListRef = dbRef(db, 'content/epk/youtubeiframes');
					epkYoutubeListListener = (snapshot) => {
						const list = document.getElementById('epkYoutubeList');
						if (!list) return;
						list.innerHTML = '';
						if (snapshot && snapshot.exists()) {
							snapshot.forEach((childSnap) => {
								const data = childSnap.val() || {};
								const key = childSnap.key;
								const row = document.createElement('div');
								row.style.display = 'flex';
								row.style.alignItems = 'center';
								row.style.gap = '8px';
								const url = data.url || '';
								// Preview iframe if it's an embed URL, otherwise show the URL text
								const previewDiv = document.createElement('div');
								previewDiv.style.flex = '1';
								if (/^https:\/\/www\.youtube\.com\/embed\//.test(url)) {
									const iframe = document.createElement('iframe');
									iframe.src = url;
									iframe.width = '320';
									iframe.height = '180';
									iframe.frameBorder = '0';
									iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
									iframe.allowFullscreen = true;
									previewDiv.appendChild(iframe);
								} else {
									previewDiv.textContent = url;
								}

								const delBtn = document.createElement('button');
								delBtn.textContent = 'Delete';
								delBtn.className = 'btn';
								delBtn.style.backgroundColor = '#d9534f';
								delBtn.addEventListener('click', async () => {
									if (!confirm('Delete this video?')) return;
									try {
										await dbRemove(dbRef(db, 'content/epk/youtubeiframes/' + key));
									} catch (err) {
										console.error('Failed to delete video:', err);
										alert('Failed to delete video.');
									}
								});

								row.appendChild(previewDiv);
								row.appendChild(delBtn);
								list.appendChild(row);
							});
						} else {
							list.textContent = 'No videos.';
						}
					};
					dbOnValue(epkYoutubeListRef, epkYoutubeListListener);

					const addBtn = document.getElementById('epkAddYoutubeListBtn');
					const listInput = document.getElementById('epkYoutubeListInput');
					const listStatus = document.getElementById('epkYoutubeListStatus');
					if (addBtn && listInput) {
						addBtn.addEventListener('click', async () => {
							const val = (listInput.value || '').trim();
							if (!val) {
								alert('Enter a YouTube embed URL to add.');
								return;
							}
							if (val && !/^https:\/\/www\.youtube\.com\/embed\//.test(val)) {
								if (!confirm('The URL does not look like a YouTube embed URL. Add anyway?')) return;
							}
							try {
								const newRef = dbPush(epkYoutubeListRef);
								await dbSet(newRef, { url: val, timestamp: Date.now() });
								listInput.value = '';
								if (listStatus) { listStatus.style.display = 'inline'; setTimeout(() => { listStatus.style.display = 'none'; }, 1500); }
							} catch (err) {
								console.error('Failed to add video:', err);
								alert('Failed to add video.');
							}
						});
					}
				} catch (err) {
					console.error('Failed to attach content/epk/youtubeiframes listener:', err);
				}

			// Attach listener for content/epk/assetText and wire up save button
			try {
				epkAssetTextRef = dbRef(db, 'content/epk/assetText');
				epkAssetTextListener = (snapshot) => {
					const textarea = document.getElementById('epkAssetTextInput');
					if (!textarea) return;
					textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
					const status = document.getElementById('epkAssetTextSaveStatus');
					if (status) status.style.display = 'none';
				};
				dbOnValue(epkAssetTextRef, epkAssetTextListener);

				const saveEpkAssetTextBtn = document.getElementById('saveEpkAssetTextBtn');
				if (saveEpkAssetTextBtn) {
					saveEpkAssetTextBtn.addEventListener('click', async () => {
						const textarea = document.getElementById('epkAssetTextInput');
						const status = document.getElementById('epkAssetTextSaveStatus');
						if (!textarea) return;
						try {
							if (status) status.style.display = 'none';
							await dbSet(epkAssetTextRef, textarea.value || '');
							if (status) status.style.display = 'inline';
						} catch (err) {
							console.error('Failed to save EPK asset text:', err);
							alert('Failed to save asset text.');
						}
					});
				}
			} catch (err) {
				console.error('Failed to attach content/epk/assetText listener:', err);
			}

			// Attach listener for content/epk/assetImages and wire up upload/delete UI (with ordering)
			try {
				epkAssetImagesRef = dbRef(db, 'content/epk/assetImages');

				// Helper to swap order values between asset images
				async function swapAssetImageOrder(targetKey, index, delta) {
					try {
						const snap = await dbGet(epkAssetImagesRef);
						if (!snap || !snap.exists()) return;
						const arr = [];
						snap.forEach((c) => { arr.push({ key: c.key, data: c.val() || {} }); });
						arr.sort((a, b) => {
							const oa = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
							const ob = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
							return oa - ob;
						});
						const currentIdx = arr.findIndex(i => i.key === targetKey);
						if (currentIdx === -1) return;
						const otherIdx = currentIdx + delta;
						if (otherIdx < 0 || otherIdx >= arr.length) return;
						const a = arr[currentIdx];
						const b = arr[otherIdx];
						const orderA = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
						const orderB = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
						// Swap the order values
						await Promise.all([
							dbSet(dbRef(db, 'content/epk/assetImages/' + a.key + '/order'), orderB),
							dbSet(dbRef(db, 'content/epk/assetImages/' + b.key + '/order'), orderA)
						]);
					} catch (err) {
						console.error('Failed to swap asset image order:', err);
						alert('Failed to reorder images.');
					}
				}

				epkAssetImagesListener = (snapshot) => {
					const list = document.getElementById('epkAssetImagesList');
					if (!list) return;
					list.innerHTML = '';
					if (snapshot && snapshot.exists()) {
						// Collect into array and sort by 'order' (fallback to timestamp)
						const items = [];
						snapshot.forEach((childSnap) => {
							items.push({ key: childSnap.key, data: childSnap.val() || {} });
						});
						items.sort((a, b) => {
							const oa = (typeof a.data.order !== 'undefined') ? a.data.order : (a.data.timestamp || 0);
							const ob = (typeof b.data.order !== 'undefined') ? b.data.order : (b.data.timestamp || 0);
							return oa - ob;
						});
						items.forEach((item, idx) => {
							const data = item.data || {};
							const key = item.key;
							const row = document.createElement('div');
							row.style.display = 'flex';
							row.style.alignItems = 'center';
							row.style.gap = '8px';
							const img = document.createElement('img');
							img.src = data.data || '';
							img.alt = data.name || '';
							img.style.width = '120px';
							img.style.height = 'auto';
							img.style.objectFit = 'cover';
							const nameDiv = document.createElement('div');
							nameDiv.textContent = data.name || '';
							nameDiv.style.flex = '1';
							// Up / Down buttons
							const controlsDiv = document.createElement('div');
							controlsDiv.style.display = 'flex';
							controlsDiv.style.flexDirection = 'column';
							controlsDiv.style.gap = '4px';
							const upBtn = document.createElement('button');
							upBtn.textContent = '▲';
							upBtn.title = 'Move up';
							upBtn.className = 'btn';
							upBtn.disabled = (idx === 0);
							upBtn.addEventListener('click', async () => { await swapAssetImageOrder(key, idx, -1); });
							const downBtn = document.createElement('button');
							downBtn.textContent = '▼';
							downBtn.title = 'Move down';
							downBtn.className = 'btn';
							downBtn.disabled = (idx === items.length - 1);
							downBtn.addEventListener('click', async () => { await swapAssetImageOrder(key, idx, 1); });
							controlsDiv.appendChild(upBtn);
							controlsDiv.appendChild(downBtn);
							const delBtn = document.createElement('button');
							delBtn.textContent = 'Delete';
							delBtn.className = 'btn';
							delBtn.style.backgroundColor = '#d9534f';
							delBtn.addEventListener('click', async () => {
								if (!confirm('Delete this image?')) return;
								try {
									await dbRemove(dbRef(db, 'content/epk/assetImages/' + key));
								} catch (err) {
									console.error('Failed to delete image:', err);
									alert('Failed to delete image.');
								}
							});
							row.appendChild(img);
							row.appendChild(nameDiv);
							row.appendChild(controlsDiv);
							row.appendChild(delBtn);
							list.appendChild(row);
						});
					} else {
						list.textContent = 'No asset images.';
					}
				};
				dbOnValue(epkAssetImagesRef, epkAssetImagesListener);

				// Upload handler (set order so new items go to end)
				const uploadBtn = document.getElementById('uploadEPKAssetImageBtn');
				const fileInput = document.getElementById('epkAssetImageFileInput');
				if (uploadBtn && fileInput) {
					uploadBtn.addEventListener('click', async () => {
						const files = fileInput.files;
						if (!files || files.length === 0) {
							alert('Please select one or more images to upload.');
							return;
						}
						for (let i = 0; i < files.length; i++) {
							const file = files[i];
							const reader = new FileReader();
							await new Promise((resolve, reject) => {
								reader.onload = async (e) => {
									try {
										const dataUrl = e.target.result;
										const newRef = dbPush(epkAssetImagesRef);
										// assign an 'order' to place at end (use timestamp)
										await dbSet(newRef, { name: file.name, data: dataUrl, timestamp: Date.now(), order: Date.now() });
										resolve();
									} catch (err) {
										reject(err);
									}
								};
								reader.onerror = () => reject(new Error('File read error'));
								reader.readAsDataURL(file);
							});
						}
						fileInput.value = '';
						const status = document.getElementById('epkAssetImageUploadStatus');
						if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 1500); }
					});
				}
			} catch (err) {
				console.error('Failed to attach content/epk/assetImages listener:', err);
			}
		} else { //User not logged in
			// Show login UI
			if (loginContainer) loginContainer.style.display = 'block';
			if (adminDashboard) adminDashboard.style.display = 'none';

			// Detach realtime listener if attached
			//Todo, detach all leftover listeners here
			try {
				if (subscribersRef && subscribersListener) {
					dbOff(subscribersRef, 'value', subscribersListener);
					subscribersRef = null;
					subscribersListener = null;
				}
				if (testimonialsRef && testimonialsListener) {
					dbOff(testimonialsRef, 'value', testimonialsListener);
					testimonialsRef = null;
					testimonialsListener = null;
				}
				if (contentRef && contentListener) {
					dbOff(contentRef, 'value', contentListener);
					contentRef = null;
					contentListener = null;
				}
				if (aboutLongRef && aboutLongListener) {
					dbOff(aboutLongRef, 'value', aboutLongListener);
					aboutLongRef = null;
					aboutLongListener = null;
				}
				if (performancesRef && performancesListener) {
					dbOff(performancesRef, 'value', performancesListener);
					performancesRef = null;
					performancesListener = null;
				}
				if (newAlbumRef && newAlbumListener) {
					dbOff(newAlbumRef, 'value', newAlbumListener);
					newAlbumRef = null;
					newAlbumListener = null;
				}
				if (youtubeRef && youtubeListener) {
					dbOff(youtubeRef, 'value', youtubeListener);
					youtubeRef = null;
					youtubeListener = null;
				}
				if (youtubeListRef && youtubeListListener) {
					dbOff(youtubeListRef, 'value', youtubeListListener);
					if (lyricsRef && lyricsListener) {
						dbOff(lyricsRef, 'value', lyricsListener);
						lyricsRef = null;
						lyricsListener = null;
					}
					youtubeListRef = null;
					youtubeListListener = null;
				}
				if (imagesRef && imagesListener) {
					dbOff(imagesRef, 'value', imagesListener);
					imagesRef = null;
					imagesListener = null;
				} 
				if (epkBioRef && epkBioListener) {
					dbOff(epkBioRef, 'value', epkBioListener);
					epkBioRef = null;
					epkBioListener = null;
				}
				if (epkTourRef && epkTourListener) {
					dbOff(epkTourRef, 'value', epkTourListener);
					epkTourRef = null;
					epkTourListener = null;
				}
				if (epkAccoladesRef && epkAccoladesListener) {
					dbOff(epkAccoladesRef, 'value', epkAccoladesListener);
					epkAccoladesRef = null;
					epkAccoladesListener = null;
				}
				if (epkPressClippingsRef && epkPressClippingsListener) {
					dbOff(epkPressClippingsRef, 'value', epkPressClippingsListener);
					epkPressClippingsRef = null;
					epkPressClippingsListener = null;
				}
				if (epkCoverRef && epkCoverListener) {
					dbOff(epkCoverRef, 'value', epkCoverListener);
					epkCoverRef = null;
					epkCoverListener = null;
				}
				if (epkAssetTextRef && epkAssetTextListener) {
					dbOff(epkAssetTextRef, 'value', epkAssetTextListener);
					epkAssetTextRef = null;
					epkAssetTextListener = null;
				}
				if (epkAssetImagesRef && epkAssetImagesListener) {
					dbOff(epkAssetImagesRef, 'value', epkAssetImagesListener);
					epkAssetImagesRef = null;
					epkAssetImagesListener = null;
				}
				if (epkImagesRef && epkImagesListener) {
					dbOff(epkImagesRef, 'value', epkImagesListener);
					epkImagesRef = null;
					epkImagesListener = null;
				} 
				// Clear table bodies
				const tbody = document.querySelector('#subscribersTable tbody');
				if (tbody) tbody.innerHTML = '';
				const tbody2 = document.querySelector('#testimonialsTable tbody');
				if (tbody2) tbody2.innerHTML = '';
			} catch (err) {
				console.error('Failed to detach listeners:', err);
			}
		}
	});
});
