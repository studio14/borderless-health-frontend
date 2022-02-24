function getAppointments() {
  const inner_page_loader = document.querySelector(
    "#upcoming-events .inner-loader-class"
  );
  const upcoming_appointment_info = document.getElementById(
    "upcoming-appointment-info"
  );

  inner_page_loader.setAttribute("style", "display:flex");
  upcoming_appointment_info.setAttribute("style", "display:none");

  let appointments = [];

  function populate() {
    var original = document.getElementsByClassName("appointment-container")[0];
    original.setAttribute("style", "display:flex");
    appointments.forEach((appointment, index) => {
      var clone = original.cloneNode(true); // "deep" clone
      original.parentNode.appendChild(clone);
      const image = document.querySelectorAll(".appointment-container img")[
        index
      ];
      const fullname = document.querySelectorAll(
        ".appointment-container .heading-5"
      )[index];
      const link = document.querySelectorAll(".appointment-container a")[index];
      image.src = appointment.profile_image;
      link.href = "/appointments/appointment?ap=" + appointment.id;
      fullname.innerHTML = appointment.firstname + " " + appointment.lastname;
    });
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      let appointmentRef = db
        .collection("test-appointments")
        .where("patient_uid", "!=", null);
      appointmentRef = appointmentRef.where("doctor_uid", "==", user.uid);
      appointmentRef
        .get()
        .then((snapshot) => {
          let index = 0;
          console.log("snapshotttt", snapshot.size);
          if (snapshot.size == 0) {
            const emptyAppointment = document.querySelector(".no-appointments");
            emptyAppointment.setAttribute("style", "display:block");
          }
          snapshot.forEach((doc) => {
            const appointmenDoc = db
              .collection("test-patients")
              .doc(doc.data().patient_uid);
            appointmenDoc.get().then((appointmentSnapshot) => {
              appointments.push({
                id: doc.id,
                ...doc.data(),
                ...appointmentSnapshot.data(),
              });
              //   const currentAppointment = {
              //     id: doc.id,
              //     ...doc.data(),
              //     ...appointmentSnapshot.data(),
              //   };
              //   populate(
              //     index,
              //     currentAppointment.firstname,
              //     currentAppointment.lastname,
              //     currentAppointment.profile_image,
              //     currentAppointment.id
              //   );
              if (snapshot.size === index) {
                populate();
              }
              index++;
            });
          });
          upcoming_appointment_info.setAttribute("style", "display:block");
          inner_page_loader.setAttribute("style", "display: none");
        })
        .catch((error) => {
          console.log(error);
          inner_page_loader.setAttribute("style", "display: none");
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  getAppointments();
});
