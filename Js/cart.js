//get cart count and show
const cartCount = document.getElementById("cartCount");

const updateCart = () => {
    let cartData = localStorage.getItem("cartData");
    if (cartData) {
        let cartDataJson = JSON.parse(cartData);
        cartCount.innerText = cartDataJson.length;
    } else {
        cartCount.innerText = 0;
    }
}

updateCart()

//cart data
const cartContainer = document.getElementById("cartContainer")

const showCart = () => {
    let cartData = localStorage.getItem("cartData");
    let html = ``;
    if (cartData) {
        let cart = JSON.parse(cartData);
        cart.forEach((item, index) => {
            let calPrice = item.prod.price * item.quantity;
            html += `<div class="row m-0 p-0 cart__table__item">
                        <div class="col-2 p-2">
                            <img src=${item.prod.img} alt="">
                        </div>
                        <div class="col-3">
                            <h3>${item.prod.title}</h3>
                        </div>
                        <div class="col-2">${item.prod.price} đ</div>
                        <div class="col-2"><span>${item.quantity}</span></div>
                        <div class="col-2">${calPrice} đ</div>
                        <div class="col-1"><i class="fa-solid fa-trash-can" onclick="event.preventDefault(); deleteItem(${index})"></i></div>
                    </div>`
        });
    }
    cartContainer.innerHTML = html;
}

showCart();

//delete item
const deleteItem = (index) => {
    let cart = [];
    let storage = localStorage.getItem("cartData")
    if (storage) {
        cart = JSON.parse(storage)
    }
    const newCart = cart.slice(0, index).concat(cart.slice(index+1));
    localStorage.setItem("cartData", JSON.stringify(newCart))
    showCart();
    updateCart();
}

//delete all
const deleteCart = () => {
    localStorage.removeItem("cartData");
    showCart();
    updateCart();
}
//continue buy
const priceContainer = document.getElementById("priceContainer");

const priceCheck = () => {
    let storage = localStorage.getItem("cartData")
    let html = ``
    if (storage) {
        //progress
        document.getElementById('cartProgressbar1').style.visibility = 'hidden';
        document.getElementById('cartProgressbar2').style.display = 'flex';
        document.getElementById('cartPaidBtn').style.display = 'block';
        //handle
        cart = JSON.parse(storage)
        let sum = 0;
        cart.forEach(item => {
            sum += item.prod.price * item.quantity;
        })
        let tax = Math.ceil(sum*0.1);
        let total = sum + tax;
        html += `<div class="col-4">
                    <div class="cart__sum__number text-uppercase">Tổng tiền (chưa thuế)</div>
                    <div class="cart__sum__number text-uppercase">Thuế (VAT 10%)</div>
                    <div class="cart__sum text-uppercase">Tổng phải thanh toán</div>
                </div>
                <div class="col-3">
                    <div class="cart__sum__number" id="cartSum">${sum} đ</div>
                    <div class="cart__sum__number" id="cartTax">${tax} đ</div>
                    <div class="cart__sum" id="cartTotal">${total} đ</div>
                </div>`

    } else {
        html += `<h2>No products found</h2>`
    }
    priceContainer.innerHTML = html
}
//confirm information
const cartPaid = () => {
    //progress
    document.getElementById('cartProgressbar2').style.visibility = 'hidden';
    document.getElementById('cartProgressbar3').style.display = 'flex';
    document.getElementById('cartPaidForm').style.display = 'flex';
    const cartPaidDate = document.getElementById("cartPaidDate");
    const today = new Date();
    cartPaidDate.innerText = `Ngày ${today.getDate()} tháng ${today.getMonth()} năm ${today.getFullYear()}`
}

const confirmPaid = async () => {
    const today = new Date();
    const sum = document.getElementById("cartSum").innerText;
    const tax = document.getElementById("cartTax").innerText;
    const total = document.getElementById("cartTotal").innerText;
    const name = document.getElementById("cartName").value;
    const phone = document.getElementById("cartPhone").value;
    const address = document.getElementById("cartAddress").value;
    const cart = JSON.parse(localStorage.getItem("cartData"))

    await fetch("http://localhost:3000/orders", {
        method: "POST",
        body: JSON.stringify({
            cart,
            info: {
                sum, tax, total, date: today
            },
            user: {
                name, phone, address
            }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => response.json())
    .then(json => console.log(json));

    deleteCart();
}
