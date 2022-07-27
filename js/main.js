function Articulo(id, nombre, precio, destacado, imagen) {
  this.id = id;
  this.nombre = nombre;
  this.precio = precio;
  this.destacado = destacado;
  this.imagen = imagen;
}

function Pedido() {
  this.items = [];
  this.total = 0;
}

function cargarDatos(productos, articulos) {
  productos.forEach((producto, indice) => {
    var articulo = new Articulo(
      producto.id,
      producto.nombre,
      producto.precio,
      producto.destacado,
      producto.imagen
    );
    articulos.push(articulo);

    if (articulo.destacado) {
      generarHtmlProducto(articulo);
    }
    cargarSelect(articulo);
    if (indice == 0) {
      $("#precio").val(articulo.precio);
    }
  });
}

function generarHtmlProducto(producto) {
  var html = `<div class="col-sm col-md-6 col-xl-3 bot1">
    <img class="imagenes" src="${producto.imagen}">
    <div class="description">
      <div class="product-name">
      ${producto.nombre}
      </div>
      <div class="price">
      $${producto.precio}
      </div>
      <button class="shop" onclick="seleccionarProducto(${producto.id})">Agregar artículo</button>
    </div>
  </div>`;
  $("#games").append(html);
}

function seleccionarProducto(productoId) {
  let posicion = $("#customer").offset().top;
  $("html, body").animate({ scrollTop: posicion }, 1000);
  $("#juegos").val(productoId).change();
}

function cargarSelect(producto) {
  var option = `<option value="${producto.id}">${producto.nombre}</option>`;
  $("#juegos").append(option);
}

function agregarPrecio() {
  $("#error").html("");
  var valor = $("#juegos option:selected").val();
  var encontrado = articulos.find((articulo) => {
    return articulo.id == valor;
  });
  $("#precio").val(encontrado.precio);
  $("#cantidad").val("");
  $("#subtotal").val("");
}

function soloNumeros(event) {
  var key = event.keyCode;
  if (key < 48 || key > 57) {
    event.preventDefault();
  }
}

function calcularSubtotal() {
  var cantidad = $("#cantidad").val();
  if (cantidad > 0) {
    $("#error").html("");
    var precio = $("#precio").val();
    var subtotal = parseInt(cantidad) * parseInt(precio);
    $("#subtotal").val(subtotal);
  } else {
    $("#error").html("Ingresar cantidad");
    $("#subtotal").val("");
  }
}

function agregarProducto() {
  var cantidad = parseInt($("#cantidad").val());
  if (cantidad > 0) {
    $("#error").html("");
    var itemId = parseInt($("#juegos").val());

    var indiceYaExiste = pedido.items.findIndex((item) => {
      return item.itemId == itemId;
    });
    if (indiceYaExiste == -1) {
      pedido.items.push({ itemId, cantidad });
    } else {
      pedido.items[indiceYaExiste].cantidad += cantidad;
    }
    $("#cantidad").val("");
    $("#subtotal").val("");
    dibujarPedido();
  } else {
    $("#error").html("Ingresar cantidad");
  }
}

function dibujarPedido() {
  var tablaHeader = `<table class="table table-hover table-dark finalizar-pedido">
  <thead>
    <tr class="items">
      <th scope="col">#</th>
      <th scope="col">Producto</th>
      <th scope="col">Precio</th>
      <th scope="col">Cantidad</th>
      <th scope="col">Subtotal</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>`;
  var tablaBody = "";
  var total = 0;
  var iconoEliminar = `Eliminar`;
  pedido.items.forEach((item, indice) => {
    var articulo = articulos.find((articulo) => {
      return item.itemId == articulo.id;
    });
    tablaBody += `<tr>
      <th scope="row">${indice + 1}</th>
      <td>${articulo.nombre}</td>
      <td>$${articulo.precio}</td>
      <td>${item.cantidad}</td>
      <td>$${parseInt(item.cantidad) * parseInt(articulo.precio)}</td>
      <td><span class="icono-eliminar" onclick="eliminarItem(${indice})">${iconoEliminar}</span></td>
    </tr>`;
    total += parseInt(item.cantidad) * parseInt(articulo.precio);


    sessionStorage.setItem("carrito", JSON.stringify(`Nombre del Juego: ${articulo.nombre}, cantidad añadida: ${item.cantidad}`));
    let gamesInCart = sessionStorage.getItem("carrito");
    console.log(gamesInCart);
  });
  var tablaFooter = `<tr>
    <td colspan="3"></td>
    <td class="total">TOTAL</td>
    <td class="monto">$${total}</td>
    <td></td>
  </tr>
  </tbody>
  </table>`;
  var ordenFinal = `
    <div class="row" >
      <div class="col-sm column-2">
        <button class="finalizar" onclick="finalizarPedido()">FINALIZAR PEDIDO</button>
      </div>
    </div>`;
  if (pedido.items.length) {
    $("#pedido-final").html(tablaHeader + tablaBody + tablaFooter);
    if ($("#orden-final").html() === "") {
      $("#orden-final").html(ordenFinal);
    }
  } else {
    $("#pedido-final").html("");
    $("#orden-final").html("");
  }
}

function eliminarItem(indice) {
  pedido.items.splice(indice, 1);
  dibujarPedido();
}

function finalizarPedido() {
  $("#detalle-pedido").html(
    Swal.fire({
      icon: 'success',
      title: 'Tu pedido ha sido realizado!',
      showConfirmButton: false,
      timer: 3000
    }));
  setTimeout(function () {
    window.location.reload();
    window.scrollTo(0, 0);
  }, 2000);

}

var articulos = [];
$.ajax({
  url: "./js/datos.json",
  dataType: "json",
  success: (response) => {
    cargarDatos(response, articulos);
  },
});
var pedido = new Pedido();
$("#cantidad").keypress(soloNumeros);

function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

// const ul = document.getElementById("authors");
const url = "https://randomuser.me/api/?results=1";

fetch(url)
  .then((resp) => resp.json())
  .then(function (data) {
    let authors = data.results;
    return authors.map(function (author) {
      let li = createNode("li");
      let span = createNode("span");
      Toastify({
        text: `Hola: ${author.name.first} ${author.name.last}`,
        duration: 3000,
        position: "left",
        className: "info",
        style: {
          background: "black",
        },
      }).showToast();
      append(li, span);
    });
  })
  .catch(function (error) {
    console.log(error);
  });

