//cart 
let cartIcon = document.querySelector("#cart-icon")
let cart = document.querySelector(".cart")
let closeCart = document.querySelector("#close-cart")
let cartCountEl = document.querySelector("#cart-count");
let discountPercent = 30;
let incVat = 18;
let freeCargoLimit = 300
let cargoPrice = 20;
var n = 1;
let carts = [];

//open Cart
cartIcon.onclick = () => {
  $(".page-cart").length == false && cart.classList.add("active");
//  cart.classList.add("active");
}

//Close cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};


//Cart working JS
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

//Making function
function ready() {
  cartCalculate()
  // discountCalculate();

  $(".product .cart-remove-page").each(function(index) {
    $(this).on('click', removeCart);

  });

  //remove items from Cart
  var removeCartButtons = document.getElementsByClassName('cart-remove')
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener('click', removeCartItem);
  }

  //Quantity Changes
  var quantityInputs = document.getElementsByClassName('cart-quantity');
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  //Add to cart
  var addCart = document.getElementsByClassName('add-cart')
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked)
  }
  //Buy button work
  document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked);
}


function discountCalculate() {
  el = $(".product-box").find(".price")
  el.each(i => {
    el.prev()[i].innerText = parseInt($(".price")[i].innerText.replace(" TL", "")) * (discountPercent / 100) + parseInt($(".price")[i].innerText.replace(" TL", ""))
    el.prev()[i].innerText += "TL"
  });



}



function cartCalculate() {
  if (localStorage.getItem('cart')) {
    allCartItems = new Array;
    allCartItems = jQuery.parseJSON(localStorage.getItem('cart'))
    let count = 0;
    let total = 0;
    console.log(allCartItems);
    allCartItems.forEach(item => {
      addProductToCart(item.title, item.price + " TL", item.img, item.qty);
      count = count + parseInt(item.qty)
      total = total + item.price * item.qty;
    });

    cartCountEl.innerText = count;
    document.getElementsByClassName("total-price")[0].innerText = total + " TL";
    updatetotal()
  }
  

}

//Buy button function 
function buyButtonClicked() {

  updatetotal();
  window.location.href = './cart.html'
}

function removeCart(){
  $(".page-cart").length && $(".cart-box .cart-remove[data-id="+ $(this).attr("data-id") +"]").click()
  $(".page-cart").length && $(this).parent().parent().remove()

}

//Remove Items from Cart
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updatetotal();
}

//Quantity Changes
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }

  // If show page in carts
  if ($(".page-cart").length) {
    $(".page-cart .product").each(function (index) {
      var qty = $(this).find(".cart-quantity")
      var price = $(this).find(".cart-price").text()
      var total = parseInt(qty.val() * price) + " TL"
      $(this).find(".total-price").text(total)
      $(".cart-box").find(".cart-quantity")[index].value = qty.val();
    });
  }


  updatetotal();
}

//Add To cart function
function addCartClicked(event) {
  var button = event.target
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
  addProductToCart(title, price, productImg);

  cart.classList.add("active");

  updatetotal();
}
var z = 0;
function addProductToCart(title, price, productImg, qty) {
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
  for (var i = 0; i < cartItemsNames.length; i++) {
    if (cartItemsNames[i].innerText == title) {
      var num = +$(cartItemsNames[i]).parent(".detail-box").find("input").val() + 1;
      $(cartItemsNames[i]).parent(".detail-box").find("input").val(num);
      return;
    }

  }

  var cartBoxContent = `
                   <img src="${productImg}" alt="" class="cart-img">
                     <div class="detail-box">
                     <div class="cart-product-title">${title}</div>
                      <div class="cart-price"> ${price}</div>
                      <input type="number" value="${qty || 1}" class="cart-quantity">
                     </div>

                    <i class='bx bxs-trash-alt cart-remove' data-id="${z++}"></i>`;

  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox)
  cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem)
  cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged)

}


//Update Total
function updatetotal() {

  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box")
  var total = 0;
  var count = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName('cart-price')[0];
    var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
    var price = parseFloat(priceElement.innerText.replace("TL", ""));
    var quantity = quantityElement.value;
    var ptitle = cartBox.getElementsByClassName("cart-product-title")[0].innerText
    var pimg = cartBox.getElementsByClassName("cart-img")[0].src;
    total = total + price * quantity;
    count = count + parseInt(quantity)

    // Save local storage items
    localStorage.getItem('cart')
    cartItem = {
      id: i,
      title: ptitle,
      img: pimg,
      price: price,
      qty: quantity
    };

    carts.push(cartItem)

  }
  cartCountEl.innerText = count;


  console.log(carts);

  localStorage.setItem('cart', JSON.stringify(carts))
  carts = []
  // Save local storage items



  total = Math.round(total * 100) / 100;

  document.getElementsByClassName("total-price")[0].innerText = total + " TL";


  if ($(".page-cart").length) {
    var vat = parseFloat(total * (incVat / 100)).toFixed(2)
    beforeTotal = total - parseFloat(total * (incVat / 100)).toFixed(2)

    document.getElementsByClassName("before-total")[0].innerText = beforeTotal + " TL" 
    document.getElementsByClassName("vat")[0].innerText = vat + " TL" 
    document.getElementsByClassName("cargoTitle")[0].innerText = total >= freeCargoLimit ? 'Kargo' : "Kargo " + freeCargoLimit + " TL üzeri ücretsiz"
    document.getElementsByClassName("cargoPrice")[0].innerText = total >= freeCargoLimit ? 'Ücretsiz' : cargoPrice + " TL" 
    document.getElementsByClassName("lastTotal")[0].innerText = total + cargoPrice + " TL" 

  }
  


}




