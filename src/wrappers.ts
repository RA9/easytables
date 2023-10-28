// /**
//  * @module wrappers
//  */
// interface Column {
//     name: string;
//     label: string;
//     sortable?: boolean;
//     sortField?: string;
//     width?: string;
//     class?: {
//         container?: string;
//         element?: string;
//     };
// }

// interface IWrapper {
//     options: {
//         clientEnabled?: boolean;
//         columns?: string[];
//         classes?: {
//             container?: string;
//             table?: string;
//             thead?: string;
//             tbody?: string;
//             search?: {
//                 container?: string;
//                 input?: string;
//             };
//         };
//         rows?: any[];
//     };
// }

// class EzyTableElement extends HTMLElement {
//     private options: IWrapper;
//     private easyTable: any;
//     constructor(options: IWrapper) {
//       super();
//         this.options = options;
//       this.ezyTable = new EzyTable(this.options);
//     }

//     connectedCallback() {
//       this.render();
//     }

//     render() {
//       const data = JSON.parse(this.getAttribute('data') || '[]');
//       this.easyTable.addData(data);
//       const tableData = this.easyTable.getData();

//       this.innerHTML = `
//         <table>
//           ${this.generateTableHeaders(tableData)}
//           ${this.generateTableRows(tableData)}
//         </table>
//       `;
//     }

//     generateTableHeaders(data) {
//       if (data.length === 0) return '';
//       const headers = Object.keys(data[0]);
//       return `
//         <thead>
//           <tr>
//             ${headers.map(header => `<th>${header}</th>`).join('')}
//           </tr>
//         </thead>
//       `;
//     }

//     generateTableRows(data) {
//       return `
//         <tbody>
//           ${data.map(row => `
//             <tr>
//               ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
//             </tr>
//           `).join('')}
//         </tbody>
//       `;
//     }
// }

// customElements.define('ezy-table', EzyTableElement);
