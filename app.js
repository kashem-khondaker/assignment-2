window.onload = () => {
  fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=mar")
    .then((res) => res.json())
    .then((data) => {
      if (data.drinks) {
        displayData(data.drinks);
      } else {
        const cartContainer = document.getElementById("cart-container");
        const p = document.createElement("p");
        p.innerText = "Your search drink is not found";
        cartContainer.appendChild(p);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please refresh the page.");
    });
};

const SearchData = () => {
  clearContainer();
  const input = document.getElementById("input-text").value;
  //   console.log("User Input:", input);

  if (!input) {
    alert("Please enter a search term!");
    return;
  }

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.drinks);
      if (data.drinks) {
        displayData(data.drinks);
      } else {
        const cartContainer = document.getElementById("cart-container");
        const h1 = document.createElement("h1");
        h1.innerText = "Your search drink is not found";
        cartContainer.appendChild(h1);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Something went wrong. Please try again later.");
    });
};

const displayData = (drinks) => {
  const cartContainer = document.getElementById("cart-container");

  drinks.forEach((drink) => {
    const div = document.createElement("div");
    div.classList.add("food-cart");
    div.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strMeal}" />
      <div class="food-cart-content">
        <h2>${drink.strDrink.slice(0, 15)}</h2>
        <div class="price">Category: ${drink.strCategory.slice(0,7)}..</div>
        <p>${drink.strInstructions.slice(0, 50)}...</p>
        <div class="cart-btn">
          <button onclick="addToCart('${drink.idDrink}')">Add to Cart</button>
          <button type="button"  onclick="openModal('${
            drink.idDrink
          }')">Details</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(div);
  });
};

let allDrinks = [];

const addToCart = (drinkId) => {

  allDrinks.push(drinkId);

  if (allDrinks.length > 7) {
    alert("You can't take more than 7 products at a time!");
    return;
  }

  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.innerText = allDrinks.length;

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then((res) => res.json())
    .then((data) => {
      singleDataLoad(data.drinks, allDrinks.length);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Something went wrong. Please try again later.");
    });
};

const singleDataLoad = (data, index) => {
  data.forEach((element) => {
    const selectedCart = document.getElementById("selected-cart");

    const div = document.createElement("div");
    div.classList.add("selected-cart-innerDiv");

    div.innerHTML = `
      <p id="cart-SL">${index}</p>
      <img class="selected-cart-img" src="${element.strDrinkThumb}" alt="${
      element.strMeal
    }" />
      <p>${element.strDrink}</p>
    `;

    selectedCart.appendChild(div);
  });
};

const openModal = (drinkId) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then((res) => res.json())
    .then((data) => {
      const drink = data.drinks[0];
      document.getElementById("modalTitle").textContent = drink.strDrink;
      document.getElementById("modalImage").src = drink.strDrinkThumb;
      document.getElementById("catagory").textContent = `Category : ${drink.strCategory}`;
      document.getElementById("isAlcoholic").textContent = `Alcoholic : ${drink.strAlcoholic}`;
      document.getElementById("FoodInstraction").textContent =drink.strInstructions.slice(0,100);

      document.getElementById("modalContent").style.backgroundColor = "#f8f9fa";

      const modal = new bootstrap.Modal(
        document.getElementById("dynamicModal")
      );
      modal.show();
    })
    .catch((error) => {
      console.error("Error fetching modal data:", error);
      alert("Unable to fetch drink details. Please try again.");
    });
};

const clearContainer = () => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";
};
