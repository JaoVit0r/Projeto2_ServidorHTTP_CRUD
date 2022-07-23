//const axios = import('axios');
const instance = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  headers: {"Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            'Access-Control-Allow-Credentials': 'true'
            } 
});

const displayTable = (objList) => {
  const tableBody = document.querySelector('tbody');
  for (obj of objList) {
    const tableRow = document.createElement('tr');
    const tdNome = document.createElement('td');
    tdNome.innerHTML = obj.nome
    tableRow.appendChild(tdNome);
    const tdCPF = document.createElement('td');
    tdCPF.innerHTML = obj.CPF
    tableRow.appendChild(tdCPF);
    const tdTelefone = document.createElement('td');
    tdTelefone.innerHTML = obj.telefone
    tableRow.appendChild(tdTelefone);
    const tdEmail = document.createElement('td');
    tdEmail.innerHTML = obj.email
    tableRow.appendChild(tdEmail);  

    const tdDelete = document.createElement('td');
    const deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = 'Deletar'
    deleteBtn.setAttribute('class', 'btn btn-danger')
    deleteBtn.setAttribute('value', obj.id)
    deleteBtn.onclick = () => {
      instance.delete("/", {data: {id: deleteBtn.value}})   
      .then(res => {    
      console.log(res);
      }
      ).catch((error) => {
        console.error("Deu erro aqui")                 
      } 
    )
    }
    tdDelete.appendChild(deleteBtn)
    tableRow.appendChild(tdDelete)
    tableBody.appendChild(tableRow);
  }  
}

instance.get("/").then(res => {    
        displayTable(res.data.data);
    }
    ).catch((error) => {
        console.error(error)                 
    }
)

function addObject(){
  instance.post("/", {
                        "nome": document.getElementById("nome").value,
                        "CPF": document.getElementById("cpf").value,
                        "telefone": document.getElementById("telefone").value,
                        "email": document.getElementById("email").value    
                      })
  .then(res => {    
        console.log(res);
    }
    ).catch((error) => {
        console.error(error)                 
    }
    )
}

function updtObject(){
  instance.put("/", {
                        "nome": document.getElementById("nome").value,
                        "CPF": document.getElementById("cpf").value,
                        "telefone": document.getElementById("telefone").value,
                        "email": document.getElementById("email").value    
                      })
  .then(res => {    
        console.log(res);
    }
    ).catch((error) => {
        console.error(error)                 
    }
    )
}
