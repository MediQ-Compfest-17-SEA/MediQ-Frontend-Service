// import ExcelJS from "exceljs";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";

// // helper buat convert ArrayBuffer → Base64
// const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   const chunkSize = 0x8000;
//   for (let i = 0; i < bytes.length; i += chunkSize) {
//     const chunk = bytes.subarray(i, i + chunkSize);
//     binary += String.fromCharCode.apply(null, Array.from(chunk));
//   }
//   return btoa(binary);
// };

// export const exportToExcel = async ({
//   fileName,
//   sheets,
// }: {
//   fileName: string;
//   sheets: { name: string; header: string[]; rows: string[][] }[];
// }) => {
//   try {
//     const workbook = new ExcelJS.Workbook();

//     // bikin tiap sheet
//     sheets.forEach(({ name, header, rows }) => {
//       const worksheet = workbook.addWorksheet(name);

//       worksheet.addRow(header);
//       rows.forEach((row) => {
//         worksheet.addRow(row);
//       });
      
//       worksheet.columns.forEach((col) => {
//         let maxLength = 10;
//         if (typeof col.eachCell === "function") {
//           col.eachCell({ includeEmpty: true }, (cell) => {
//             const len = cell.value ? cell.value.toString().length : 0;
//             if (len > maxLength) maxLength = len;
//           });
//         }
//         col.width = maxLength + 2;
//       });
//     });

//     // convert ke buffer
//     const buffer = await workbook.xlsx.writeBuffer();
//     const base64 = arrayBufferToBase64(buffer);

//     const uri = FileSystem.documentDirectory + fileName + ".xlsx";
//     console.log(uri)
//     await FileSystem.writeAsStringAsync(uri, base64, {
//       encoding: FileSystem.EncodingType.Base64,
//     });
//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(uri);
//     } else {
//       alert("Sharing not available");
//     }
//   } catch (err) {
//     console.error("Excel export error:", err);
//   }
// };
