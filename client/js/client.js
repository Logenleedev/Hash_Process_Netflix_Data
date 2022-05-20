
const fileInput = document.getElementById('file')
const submitFile = document.getElementById('submitFile')
const btn1 = document.getElementById('submitInfo')
const btn2 = document.getElementById('finalsubmitFile')


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
  const username_form = document.getElementById('Username')
  const prolific_id_form = document.getElementById('prolific_id')
  const file_upload_field = document.getElementById('file')

  username_form.value = ''
  prolific_id_form.value = ''
  file_upload_field.value = ''

  const formData = new FormData()
  





  formData.append('file', file)

  fetch('/csv_upload', {
    method: 'POST',
    body: formData,
    redirect: 'follow'
  })
  .then((response) => response.json())
  .then(({ data }) => {
    if (data.length) {
    //   console.log(data)
      const columns = data[0]

      console.log(columns)
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
       

        let csv = []
        
        console.log(data_filtered[0])
        for (j = 0; j < data_filtered.length; j++){
          let map = {}
          for (i = 0; i < data_filtered[j].length; i++){
            map[columns[i]] = data_filtered[j][i]
          }
          csv.push(map)
          map = {}
        }

        console.log(csv)

        btn2.addEventListener('click', function () {
          fetch('/submission', {
            method: 'POST',
            body: JSON.stringify({data: csv}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then((response) => response.json())
          .then(({ data }) => {console.log(data)})
        })

        // console.log(data_filtered[0])

        const rows = data_filtered.splice(0).map((arr) => {
            const obj = {}
            columns.forEach((column, index) => {
              obj[column] = arr[index]
            })
            
            return obj
          })
         



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


