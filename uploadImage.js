// Image upload function
function uploadImage(fileInputId, callback) {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            callback(data.secure_url);
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
}
