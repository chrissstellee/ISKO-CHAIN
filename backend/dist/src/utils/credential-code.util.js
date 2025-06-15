"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCredentialCode = generateCredentialCode;
function generateCredentialCode(credentialType, credentialDetails) {
    function getPrefix(type) {
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
    let detailShort = "";
    if (credentialType === "Course Completion" || credentialType === "Workshop Certificate") {
        detailShort = "-" + (credentialDetails?.split(" ").map(w => w[0]).join("").toUpperCase() || "");
    }
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${detailShort}-${year}-${randomPart}`;
}
//# sourceMappingURL=credential-code.util.js.map