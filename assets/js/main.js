const items = document.getElementById('items');

let carrito=[]; 

// getDAta es una funcion async la cual trae de data.js los datos de los productos.
const getData = async () => {
  const response  =  await fetch('../../data.json');
  const data = await response.json();
  return data;
}
// esta funcion asyncrona lo que hace es traer datos y modificar el dom para mostrar en pantalla el producto.
    const printProduct = async() =>{
      const product = await getData();
    
      product.forEach((data)=>{
        const card = document.createElement('div')
        const html = ` <div class="d-flex justify-content-center mb-4">
        <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
        <h5 class="card-title pt-2 text-center text-primary">${data.nombre}</h5>
        <img src="${data.imagen}" class="image image card-img-top" alt="...">
        <div class="card-body">
        <p class="card-text   text-white-50 descripription">${data.desc}</p>
        <div class="d-flex">
        <select id="selectInput" class="tamaño mb-3 form-select form-select-sm" aria-label=".form-select-sm example">
        <option  value="1" ">Una carne</option>
        <option value="2" >Dos carnes</option>
        <option value="3" >Tres carnes</option>
        </select>
        <h5 class="d-flex text-primary mx-4 ">$<p id="price">${data.precio}</p></h5>
        </div>
        
        <div class="d-grid gap-2">
        <button class="btn btn-primary button" id = "${data.id}" ">Añadir a Carrito</a>
        </div>
        </div>
        </div>
        </div> `;
        card.innerHTML = html;
        items.appendChild(card);
      })
    }
    printProduct();
    
    
    // esta funcion se encarga de obtener los valores del input seleccionado cuando se escucha el evento click y modifica el precio del producto

    document.addEventListener("change", async (e) => {
      if (e.target.matches("#selectInput")) {
        let card = e.target.parentNode.parentElement;
        console.log(card)
        let id = card.querySelector(".btn").getAttribute("id");
        console.log(`ID : ${id}`);
        const price = card.querySelector("#price");
        const value = e.target.value;
        console.log(`Valor seleccionado ${value}`);
        const product = await getData();
        product.forEach((element) => {
          if (element.id == id) {
            if (value == 1) {
              price.textContent = `${element.precio}`;
            } else if (value == 2) {
              price.textContent = `${element.precio + 100}`;
              } else if (value == 3) {
                price.textContent = `${element.precio + 200}`;
              }
            }
          });
        }
        e.stopPropagation();
        
      });
  // guarda los datos en el storage del carrito
  const storageCarrito = (carrito) => {
    const  json = JSON.stringify(carrito);
    localStorage.setItem('carrito',json)
  }
  // trae los datos del storage del carrito
  const fetchStorageCarrito   = () => JSON.parse(localStorage.getItem('carrito'));

  const existe = localStorage.getItem('carrito');
  // utilizo el operador ternario
  existe && ( carrito = fetchStorageCarrito() );
 
// crea un objeto (producto) y se guarda dentro del storage con la clave carrito
  items.addEventListener('click', e => {
    if(e.target.matches('.btn-primary')){
      const card = e.target.parentElement.parentElement.parentElement;
      const id = e.target.id;
      const imgValue = card.querySelector('.image').getAttribute('src');
      const img = imgValue.replace("./assets","..");
      const name = card.querySelector('.card-title').textContent;
      const price = card.querySelector('#price').textContent;
      const value = card.querySelector('#selectInput').value;
      const producto = {
        id: id,
        img: img,
        name: name,
        price: price,
        value : value,
        cantidad: 1
      };
      if(fetchStorageCarrito() === null){
        carrito.push(producto);
        storageCarrito(carrito);
      }else{
        if( carrito.find(element => (element.id === producto.id)&&(element.value === producto.value))){
          carrito.forEach(element => {
            if((element.id ===producto.id)&&(element.value === producto.value)){
              // aca utilizo operadores avanzados
              element.cantidad++;
            }
          })
        }else{
          carrito.push(producto);
        }

          storageCarrito(carrito);
        }
      }
      e.stopPropagation();  
    }); 