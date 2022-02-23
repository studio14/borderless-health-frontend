function getAppointments() {
    const inner_page_loader = document.querySelector('#upcoming-events .inner-loader-class');
    const upcoming_appointment_info = document.getElementById('upcoming-appointment-info');

    inner_page_loader.setAttribute('style', 'display:flex');
    upcoming_appointment_info.setAttribute('style', 'display:none');

    let appointments = []

    function populate(index, firstname, lastname, profile_image, id) {
        var original = document.getElementsByClassName('appointment-container')[0];
        var clone = original.cloneNode(true); // "deep" clone
        original.parentNode.appendChild(clone);
        const image = document.querySelectorAll('.appointment-container img')[index];
        const fullname = document.querySelectorAll('.appointment-container .heading-5')[index];
        const link = document.querySelectorAll('.appointment-container a')[index];
        image.src = profile_image;
        link.href = '/appointments/appointment?ap=' + id
        fullname.innerHTML = firstname + " " + lastname;
    }

    const testRef = db.collection('test-appointments').where(Boolean("patient_uid"));
    console.log("userrrrrrr", user);
    // firebase.auth().currentUser
    // testRef = testRef.where("doctor_uid" === )
    testRef.get().then((snapshot) => {
        let index = 0
        snapshot.forEach((doc) => {
            const appointmenDoc = db.collection('test-patients').doc(doc.data().patient_uid)
            appointmenDoc.get().then((appointmentSnapshot) => {
                appointments.push({ id: doc.id, ...doc.data(), ...appointmentSnapshot.data() })
                const currentAppointment = { id: doc.id, ...doc.data(), ...appointmentSnapshot.data() }
                populate(index, currentAppointment.firstname, currentAppointment.lastname, currentAppointment.profile_image, currentAppointment.id);
                index++;
            })
        });
        upcoming_appointment_info.setAttribute('style', 'display:block');
        inner_page_loader.setAttribute('style', 'display: none');

    }).catch((error) => {
        console.log(error);
        inner_page_loader.setAttribute('style', 'display: none');
    })
}

