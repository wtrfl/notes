import { Timestamp } from "firebase/firestore";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function formattedNoteDate(timestamp: Timestamp, style: "short" | "long") {
    if (!timestamp) return "";
    
    const lastModified = timestamp.toDate();

    if (style === "short") {
        return (
            lastModified.getMonth()+1 + "/" +
            lastModified.getDate() + "/" +
            lastModified.getFullYear().toString().slice(-2)
        )
    } else if (style === "long") {
        const hours = lastModified.getHours();
        const formattedHours =  hours > 12 ? hours-12 : hours;
        const ampm = hours > 12 ? 'PM' : 'AM';
        return (
            monthNames[lastModified.getMonth()] + " " +
            lastModified.getDate() + ", " +
            lastModified.getFullYear() + " at " +
            formattedHours + ":" +
            lastModified.getMinutes() + " " +
            ampm
        )
    }
}