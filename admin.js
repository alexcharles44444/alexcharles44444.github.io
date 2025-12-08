// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getDatabase, ref as dbRef, onValue as dbOnValue, off as dbOff, remove as dbRemove, set as dbSet, push as dbPush } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

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
let performancesRef = null;
let performancesListener = null;
let newAlbumRef = null;
let newAlbumListener = null;
let youtubeRef = null;
let youtubeListener = null;
let imagesRef = null;
let imagesListener = null;

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
							phoneTd.textContent = data.phone || '';
							emailTd.textContent = data.email || '';
							tr.appendChild(phoneTd);
							tr.appendChild(emailTd);
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

				// Attach listener for content/aboutme and wire up save button
				try {
					contentRef = dbRef(db, 'content/aboutme');
					contentListener = (snapshot) => {
						const textarea = document.getElementById('aboutMeInput');
						if (!textarea) return;
						textarea.value = snapshot && snapshot.exists() ? snapshot.val() : '';
						// hide status when content changes externally
						const status = document.getElementById('aboutSaveStatus');
						if (status) status.style.display = 'none';
					};
					dbOnValue(contentRef, contentListener);

					// Save button
					const saveBtn = document.getElementById('saveAboutBtn');
					if (saveBtn) {
						saveBtn.addEventListener('click', async () => {
							const textarea = document.getElementById('aboutMeInput');
							const status = document.getElementById('aboutSaveStatus');
							if (!textarea) return;
							try {
								if (status) { status.style.display = 'none'; }
								await dbSet(dbRef(db, 'content/aboutme'), textarea.value || '');
								if (status) { status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
							} catch (err) {
								console.error('Failed to save About Me:', err);
								alert('Failed to save About Me.');
							}
						});
					}
				} catch (err) {
					console.error('Failed to attach content/aboutme listener:', err);
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

				// Attach listener for content/images and wire up upload/delete UI
				try {
					imagesRef = dbRef(db, 'content/images');
					imagesListener = (snapshot) => {
						const list = document.getElementById('imagesList');
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
								const img = document.createElement('img');
								img.src = data.data || '';
								img.alt = data.name || '';
								img.style.width = '120px';
								img.style.height = 'auto';
								img.style.objectFit = 'cover';
								const nameDiv = document.createElement('div');
								nameDiv.textContent = data.name || '';
								nameDiv.style.flex = '1';
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
								row.appendChild(delBtn);
								list.appendChild(row);
							});
						} else {
							list.textContent = 'No images.';
						}
					};
					dbOnValue(imagesRef, imagesListener);

					// Upload handler
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
											await dbSet(newRef, { name: file.name, data: dataUrl, timestamp: Date.now() });
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
		} else {
			// Show login UI
			if (loginContainer) loginContainer.style.display = 'block';
			if (adminDashboard) adminDashboard.style.display = 'none';

			// Detach realtime listener if attached
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
				if (imagesRef && imagesListener) {
					dbOff(imagesRef, 'value', imagesListener);
					imagesRef = null;
					imagesListener = null;
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
