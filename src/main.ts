import Table from './table'
import TableData from './table/model/table.data'

const table = new Table('#app')
  .load({
    name: "Test Table",
    sheets: [{
      name: "sheet1",
      cells: {
        "A1": { addr: "A1", value: "hello" },
        "D3": { addr: "D3", value: "cell" },
        "E6": { addr: "E6", value: "ABCD" },
      },
      rowMetas: { 0: { height: 70 }, 5: { height: 70 }, count: 20 },
      colMetas: { 0: { width: 100 }, 3: { width: 150 }, count: 10 }
    }]
  })
  .on('update', (tableData: TableData) => {
    console.log(tableData, "main update on event")
  })