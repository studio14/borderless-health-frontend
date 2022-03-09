document.addEventListener("DOMContentLoaded", function () {
  loadAppointment();
});
// To load appointment
const loadAppointment = () => {
  document
    .querySelector(".appointment-card")
    .setAttribute("style", "display:none");

  const params = new URLSearchParams(location.search);
  const apQuery = params.get("ap");
  const appointmentTime = params.get("t");

  const patientName = document.querySelector(".patient-name");
  const dob = document.querySelector(".patient-dob");
  const phoneNumber = document.querySelector(".patient-phone");
  const profileImg = document.querySelector(".profile-img");
  const BackgroundInfo = document.querySelector(".patient-bg-info");
  const meetingLink = document.querySelector(".meeting-link");
  const documents = document.querySelectorAll(".patient-img-upload");
  const appointment = db.collection("test-appointments").doc(apQuery);

  // To display upcoming or previous appointment
  const upcomingAp = document.querySelector(".tab-link-tab-1");
  const prevAp = document.querySelector(".tab-link-tab-2");
  console.log("oya ooo", appointmentTime, upcomingAp, prevAp);
  if (appointmentTime === "pr") {
    upcomingAp.setAttribute("aria-selected", "false");
    upcomingAp.setAttribute("tabindex", "-1");
    upcomingAp.classList.remove("w--current");
    upcomingAp.addEventListener('click', () => {
      window.location = "https://borderless-health-doctors-side.webflow.io/appointments/all"
    })

    prevAp.setAttribute("aria-selected", "true");
    prevAp.classList.add("w--current");
  } else if (appointmentTime === "up") {
    prevAp.setAttribute("aria-selected", "false");
    prevAp.setAttribute("tabindex", "-1");
    prevAp.classList.remove("w--current");
    prevAp.addEventListener('click', () => {
      window.location = "https://borderless-health-doctors-side.webflow.io/appointments/all"
    })

    upcomingAp.setAttribute("aria-selected", "true");
    upcomingAp.classList.add("w--current");
  }

  // To fetch appointment details
  appointment.get().then((snapshot) => {
    const result = snapshot.data();
    const patient = db.collection("test-patients").doc(result.patient_uid);
    patient
      .get()
      .then((patientSnapshot) => {
        const patientData = patientSnapshot.data();
        meetingLink.href = result.meeting_url;
        meetingLink.innerHTML =
          result.date.toDate().toLocaleDateString("en-US") +
          " at " +
          result.time_from;
        BackgroundInfo.innerHTML = result.patient_background_info;
        dob.innerHTML = "DOB: " + patientData.dob.toDate().toDateString();
        patientName.innerHTML =
          patientData.firstname + " " + patientData.lastname;
        phoneNumber.innerHTML = "Phone No: " + patientData.phone_number;
        profileImg.src = patientData.profile_image;
        result.patient_documents.forEach((doc, index) => {
          if (index > 0) {
            var clone = documents[0].cloneNode(true); // "deep" clone
            documents[0].parentNode.appendChild(clone);
            documents[index].setAttribute("href", doc.url);
            if (doc.mimeType !== "application/pdf") {
              document.querySelectorAll(".patient-img-upload img")[index].src =
                doc.url;
            }
            document
              .querySelectorAll(".patient-img-upload div")
              [index].setAttribute(
                "style",
                "text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 10ch;"
              );
            document.querySelectorAll(".patient-img-upload div")[
              index
            ].innerHTML = doc.name;
          } else {
            documents[0].setAttribute("href", doc.url);
            if (doc.mimeType !== "application/pdf") {
              document.querySelectorAll(".patient-img-upload img")[0].src =
                doc.url;
            }
            document
              .querySelectorAll(".patient-img-upload div")[0]
              .setAttribute(
                "style",
                "text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 10ch;"
              );
            document.querySelectorAll(".patient-img-upload div")[0].innerHTML =
              doc.name;
          }
        });
        document
          .querySelector(".appointment-card")
          .setAttribute("style", "display:block");
      })
      .catch((error) => {
        console.log("error: ", error);
        document
          .querySelectorAll(".error-text")
          [appointmentTime === "up" ? 0 : 1].setAttribute(
            "style",
            "display:block"
          );
      });
  });
};
