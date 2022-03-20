const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function convertDate(date) {
  date = new Date(date);
  return (
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
  );
}

function returnDateOfBook(date) {
  let currDate = new Date(date);
  currDate.setMonth(currDate.getMonth() + 1);
  return convertDate(currDate);
}

function diffDays(date1, date2) {
  var newDate1 = new Date(date1);
  var newDate2 = new Date(date2);
  if (newDate1 > newDate2) return 0;
  return parseInt((newDate2 - newDate1) / (1000 * 60 * 60 * 24), 10);
}

const fillBooksDate = (userDetails) => {
  for (let i = 0; i < userDetails.booksIssued.length; i++) {
    let currIssuedDate = userDetails.booksIssued[i].issuedDate;
    userDetails.booksIssued[i] = {
      ...userDetails.booksIssued[i],
      returnDate: returnDateOfBook(currIssuedDate),
      daysLate: diffDays(
        returnDateOfBook(currIssuedDate),
        convertDate(new Date())
      ),
      issuedDate: convertDate(currIssuedDate),
    };
  }
  return userDetails;
};

export { fillBooksDate, returnDateOfBook, diffDays, convertDate, months };
