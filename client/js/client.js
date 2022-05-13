
const fileInput = document.getElementById('file')
const submitFile = document.getElementById('submitFile')
const btn1 = document.getElementById('submitInfo')

let file = null
let username = null
let prolific_id = null
let profile_hashmap = {}




fileInput.addEventListener('change', function () {
  file = this.files[0]
})

btn1.addEventListener('click', function () {
    username = document.getElementById('Username').value
    prolific_id = document.getElementById('prolific_id').value
    profile_hashmap[username] = prolific_id

})



submitFile.addEventListener('click', function () {
  if (!file || file.type !== 'text/csv') {
    alert('Please choose a CSV file')
    return
  }



  const formData = new FormData()
  





  formData.append('file', file)

  fetch('/csv_upload', {
    method: 'POST',
    body: formData
  })
  .then((response) => response.json())
  .then(({ data }) => {
    if (data.length) {
    //   console.log(data)
      const columns = data[0]
      
      let data_filtered = []

      for(let i = 1; i < data.length; i++){
        if (data[i][0] == username){
            data_filtered.push(data[i])
            data[i][0] = profile_hashmap[username]
        }
      }

      if (data_filtered.length == 0){
          alert("Something is wrong!")
      } else {

        const rows = data_filtered.splice(1).map((arr) => {
            const obj = {}
            columns.forEach((column, index) => {
              obj[column] = arr[index]
            })
            
            return obj
          })
    
        //   console.log(rows, columns)
        
        const table = new Tabulator("#csvTable", {
            height:"300px",
            data: rows,
            autoColumns: true
          });
  
        console.log("Success!")
      }
    } else {
      alert('The CSV is empty')
    }
  })
  .catch((e) => alert(e.message))})