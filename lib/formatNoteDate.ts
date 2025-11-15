import { Timestamp } from "firebase/firestore";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const shortDate = (date: Date) => (
    date.getMonth()+1 + "/" +
    date.getDate() + "/" +
    date.getFullYear().toString().slice(-2)
)

const longDate = (date: Date) => {
    const hours = date.getHours();
    const formattedHours =  hours > 12 ? hours-12 : hours;
    const ampm = hours > 12 ? 'PM' : 'AM';
    return (
        monthNames[date.getMonth()] + " " +
        date.getDate() + ", " +
        date.getFullYear() + " at " +
        formattedHours + ":" +
        date.getMinutes() + " " +
        ampm
    )
}

export default function formattedNoteDate(timestamp: Timestamp, style: "short" | "long") {
    let date;

    if (timestamp) {
        date = timestamp.toDate();
    } else {
        date = new Date();
    }

    if (style === "short") {
        return shortDate(date);
    } else if (style === "long" && timestamp) {
        return longDate(date)
    } else if (style === "long" && !timestamp) {
        return "fetching..."
    }
}