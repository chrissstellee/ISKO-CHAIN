/* eslint-disable prettier/prettier */
export function generateCredentialCode(credentialType: string, credentialDetails: string) {
    function getPrefix(type: string) {
    switch (type) {
        case "Degree Certificate": return "DIP";
        case "Course Completion": return "COMP";
        case "Honor/Award": return "HONOR";
        case "Workshop Certificate": return "WS";
        case "Transcript": return "TRANS";
        default: return "CRED";
    }
    }
    const prefix = getPrefix(credentialType);
    const year = new Date().getFullYear();

  // For course completion/workshop, you could use details abbreviation (optional)
    let detailShort = "";
    if (credentialType === "Course Completion" || credentialType === "Workshop Certificate") {
        detailShort = "-" + (credentialDetails?.split(" ").map(w => w[0]).join("").toUpperCase() || "");
    }

  // This should be unique: use a random number or a DB sequence/counter
  const randomPart = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}${detailShort}-${year}-${randomPart}`;
}