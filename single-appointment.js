document.addEventListener("DOMContentLoaded", function () {
  loadAppointment();
});
// To load appointment
const loadAppointment = () => {
  const params = new URLSearchParams(location.search);
  const apQuery = params.get("ap");

  const patientName = document.querySelector(".patient-name");
  const dob = document.querySelector(".patient-dob");
  const phoneNumber = document.querySelector(".patient-phone");
  const profileImg = document.querySelector(".profile-img");
  const BackgroundInfo = document.querySelector(".patient-bg-info");
  const meetingLink = document.querySelector(".meeting-link");
  const documents = document.querySelectorAll(".patient-img-upload");
  const appointment = db.collection("test-appointments").doc(apQuery);
  appointment.get().then((snapshot) => {
    const result = snapshot.data();
    const patient = db.collection("test-patients").doc(result.patient_uid);
    patient.get().then((patientSnapshot) => {
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
            document.querySelectorAll(".patient-img-upload img")[index].src = doc.url;
          }
        } else {
          documents[0].setAttribute("href", doc.url);
          if (doc.mimeType !== "application/pdf") {
            document.querySelectorAll(".patient-img-upload img")[0].src = doc.url;
          }
        }
      });
      document
        .querySelector(".appointment-card")
        .setAttribute("style", "display:block");
    });
  });
};
