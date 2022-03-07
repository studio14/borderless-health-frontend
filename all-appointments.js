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
    const previousAppointmentsParent = document.querySelector(
      ".previous-appointment-info"
    );
    const currentDate = new Date();

    const upcomingAppointments = appointments.filter(
      (ap) => ap.date.toDate() > currentDate
    );
    const previousAppointments = appointments.filter(
      (ap) => ap.date.toDate() < currentDate
    );
    console.log("upcomingAppointments", upcomingAppointments);
    console.log("previousAppointments", previousAppointments);

    if (upcomingAppointments.length === 0) {
      const emptyAppointment = document.querySelector(
        ".upcoming-appointment .no-appointments"
      );
      emptyAppointment.setAttribute("style", "display:block");
    }
    if (previousAppointments.length === 0) {
      const emptyAppointment = document.querySelector(
        ".previous-appointment .no-appointments"
      );
      emptyAppointment.setAttribute("style", "display:block");
    }
    upcomingAppointments.forEach((appointment, index) => {
      upcoming_appointment_info.setAttribute("style", "display:block");
      if (index > 0) {
        var clone = original.cloneNode(true); // "deep" clone
        original.parentNode.appendChild(clone);
      }
      const image = document.querySelectorAll(
        ".upcoming-appointment .appointment-container img"
      )[index];
      const fullname = document.querySelectorAll(
        ".appointment-container .heading-5"
      )[index];
      const day = document.querySelectorAll(
        ".upcoming-appointment .appointment-container .day"
      )[index];
      const month = document.querySelectorAll(
        ".upcoming-appointment .appointment-container .month"
      )[index];
      const link = document.querySelectorAll(
        ".upcoming-appointment .appointment-container a"
      )[index];
      image.src = appointment.profile_image;
      month.innerHTML = appointment.date.toDate().toString().substring(4, 7);
      day.innerHTML = appointment.date.toDate().toString().substring(8, 10);
      link.href = `/appointments/appointment?ap=${appointment.id}&t=${
        appointment.date.toDate() > currentDate ? "up" : "pr"
      }`;
      fullname.innerHTML = appointment.firstname + " " + appointment.lastname;
    });
    previousAppointments.forEach((appointment, index) => {
      console.log("appointment", appointment);
      var clone = original.cloneNode(true); // "deep" clone
      previousAppointmentsParent.appendChild(clone);

      const image = document.querySelectorAll(
        ".previous-appointment .appointment-container img"
      )[index];
      const fullname = document.querySelectorAll(
        ".appointment-container .heading-5"
      )[index];
      const day = document.querySelectorAll(
        ".previous-appointment .appointment-container .day"
      )[index];
      const month = document.querySelectorAll(
        ".previous-appointment .appointment-container .month"
      )[index];
      const link = document.querySelectorAll(
        ".previous-appointment .appointment-container a"
      )[index];
      image.src = appointment.profile_image;
      month.innerHTML = appointment.date.toDate().toString().substring(4, 7);
      day.innerHTML = appointment.date.toDate().toString().substring(8, 10);
      link.href = "/appointments/appointment?ap=" + appointment.id;
      fullname.innerHTML = appointment.firstname + " " + appointment.lastname;
    });
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("rrr: ", user);
      let appointmentRef = db
        .collection("test-appointments")
        .where("patient_uid", "!=", "");
      appointmentRef = appointmentRef.where("doctor_uid", "==", user.uid);
      appointmentRef
        .get()
        .then((snapshot) => {
          let index = 0;
          console.log("snapshot", snapshot.length);
          if (snapshot.length === 0) {
            console.log("logoogogo");
            inner_page_loader.setAttribute("style", "display: none");
            const emptyAppointment = document.querySelector(
              ".upcoming-appointment .no-appointments"
            );
            emptyAppointment.setAttribute("style", "display:block");
          }
          snapshot.forEach((doc) => {
            console.log("doc.data()", doc.data());
            const appointmenDoc = db
              .collection("test-patients")
              .doc(doc.data().patient_uid);
            appointmenDoc.get().then((appointmentSnapshot) => {
              appointments.push({
                id: doc.id,
                ...doc.data(),
                ...appointmentSnapshot.data(),
              });
              console.log(
                "to date sunbstr",
                doc.data().date.toDate().toString()
              );
              if (snapshot.size === index + 1) {
                populate();
              }
              index++;
            });
          });
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
