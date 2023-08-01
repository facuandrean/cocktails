const d = document;
const $xhr = d.getElementById('xhr');
const $fragment = d.createDocumentFragment();
const $btn = d.querySelector('.hamburger' || '.hamburger *');
const $nav = d.querySelector('.nav');
const $search_cocktail = d.getElementById('search-cocktail');
const $page_numbers = d.querySelectorAll('.navigation a');
const $filter_alcoholic_link = d.getElementById("filter-alcoholic");
const $filter_category_link = d.getElementById("filter-category");
const $search_by_ingredient = d.getElementById("search-by-ingredient");
const $options_alcoholic = d.querySelector(".options-alcoholic");
const $options_category = d.querySelector(".options-category");
const $search_by_ingredient_input = d.querySelector(".search_by_ingredient");
const $btnUp = d.querySelector('.up');

let count = 0;
let inputTimer;

function iterateIngredients(cocktail) {
    let array = [];
    for (let i = 1; i <= 15; i++) {
        let ingredient = cocktail[`strIngredient${i}`];
        if (ingredient != null) {
            array.push(ingredient)
        }
    }
    return array
}

function loadIngredients(ol, array, li, preparation, a) {
    ol.appendChild(li);
    array.forEach(el => {
        const $li = d.createElement('li');
        $li.textContent = el;
        ol.appendChild($li);
    })
    preparation.appendChild(a);
    ol.appendChild(preparation);
}

function requests(url, request='none', filter='none') {
    const xhr = new XMLHttpRequest();
    
    xhr.addEventListener('readystatechange', e => {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);
    
            if (request == 'list_cocktails') {
                $xhr.innerHTML = '';

                if (json.drinks == null) {
                    $xhr.innerHTML = 'No items';
                    $xhr.style.textAlign = 'center';
                    $xhr.style.fontSize = '1.5rem';
                } else {
                    json.drinks.forEach((el) => {
                        count += 1;
            
                        const $card = d.createElement('div');
                        $card.classList.add('card');
    
                        const $card_front = d.createElement('div');
                        $card_front.classList.add('card-front');
                        const $card_back = d.createElement('div');
                        $card_back.classList.add('card-back');
    
                        const $picture = d.createElement('picture');
                        const $img = d.createElement('img');
                        $img.src = `${el.strDrinkThumb}`;
                        $img.alt = `${el.strDrink}`;
                        $img.loading = 'lazy';
                        $picture.appendChild($img);
    
                        const $h2 = d.createElement('h2');
                        $h2.innerHTML = `${el.strDrink}`;
    
                        const $h3 = d.createElement('h3');
                        $h3.innerHTML = `${el.strCategory}`;
    
                        const $ol = d.createElement('ol');
                        $ol.setAttribute('data-ol-id', count);
    
                        const $h4 = d.createElement('h4');
                        $h4.textContent = 'Ingredients';
    
                        const $preparation = d.createElement('li');
                        $preparation.style.position = 'relative';
                        $preparation.style.zIndex = 9999;
                        $preparation.style.margin = '2rem 0rem';
    
                        const $a = d.createElement('a');
                        $a.textContent = 'See preparation ▶';
                        $a.href = '#preparation';
                        $a.style.color = 'rgb(184, 180, 180)';
                        $a.style.fontSize = '1.2rem';
                        $a.style.cursor = 'pointer';
                        $a.id = 'flipLink';
            
                        let ingredients_array = iterateIngredients(el);
                        loadIngredients($ol, ingredients_array, $h4, $preparation, $a);
    
                        $card.setAttribute('data-card-id', count);
    
                        $card_front.appendChild($picture);
                        $card_front.appendChild($h2);
                        $card_front.appendChild($h3);
                        $card_front.appendChild($ol);
    
                        const $div_text_instructions = d.createElement('div');
                        $div_text_instructions.style.width = '100%';
                        $div_text_instructions.style.height = '200px';
    
                        const $title_instructions = d.createElement('h2');
                        $title_instructions.innerHTML = 'Preparation:';
    
                        const $instructions = d.createElement('p');
                        $instructions.innerHTML = `${el.strInstructions}`;
                        $instructions.style.textOverflow = 'ellipsis';
                        $instructions.style.color = "white";
    
                        $div_text_instructions.appendChild($title_instructions);
                        $div_text_instructions.appendChild($instructions);
                        
                        const $preparation_link = d.createElement('a');
                        $preparation_link.href = `${el.strVideo}`;
                        if ($preparation_link.href.includes('null')) {
                            $preparation_link.href = `https://www.youtube.com/results?search_query=how+to+make+the+cocktail+${el.strDrink}`;
                            $preparation_link.innerHTML = 'Search on youtube';
                            $preparation_link.target = '_black';
                        } else {
                            $preparation_link.innerHTML = 'Video on youtube';
                            $preparation_link.target = '_black';
                        }
                        $preparation_link.style.color = "gray";
                        
                        const $unFlip = d.createElement('a');
                        $unFlip.id = 'unFlipLink';
                        $unFlip.textContent = '◀ Back';
                        $unFlip.style.cursor = 'pointer';
                        $unFlip.style.color = 'gray';
                        $unFlip.style.display = 'block';
    
                        $card_back.appendChild($div_text_instructions);
                        $card_back.appendChild($preparation_link);
                        $card_back.appendChild($unFlip);
                        $card_back.style.backgroundColor = "rgb(2,0,36)";
    
                                   
                        $card.appendChild($card_front);
                        $card.appendChild($card_back);
                        
                        $fragment.appendChild($card);
                    });
    
                    $xhr.appendChild($fragment);
    
                    const $cards = d.querySelectorAll('.card');
    
                    $cards.forEach(card => {
                        card.addEventListener('click', handleClick);
                        const HTMLlis = card.children[0].children[3].getElementsByTagName('li');
                        const lastLis = HTMLlis[HTMLlis.length - 1];
                        lastLis.addEventListener('click', e => {
                            card.classList.toggle('flipped')
                            card.children[1].style.display = 'flex';
                        });
                        const unFlip = card.children[1].children[2];
                        unFlip.addEventListener('click', e => {
                            card.classList.toggle('flipped')
                            card.children[1].style.display = 'none';
                        })
                    });

                }

            };

            if (request == 'filter_cocktail') {
                $xhr.innerHTML = '';

                json.drinks.forEach((el) => {
                    const $card = d.createElement('div');
                    $card.classList.add('card');

                    const $picture = d.createElement('picture');
                    const $img = d.createElement('img');
                    $img.src = `${el.strDrinkThumb}`;
                    $img.alt = `${el.strDrink}`;
                    $picture.appendChild($img);

                    const $h2 = d.createElement('h2');
                    $h2.innerHTML = `${el.strDrink}`;

                    const $h3 = d.createElement('h3');
                    $h3.innerHTML = filter;

                    const $ol = d.createElement('ol');

                    const $h4 = d.createElement('h4');
                    $h4.textContent = 'There is no information about the ingredients.';
                    $ol.appendChild($h4);

                    $card.appendChild($picture);
                    $card.appendChild($h2);
                    $card.appendChild($h3);
                    $card.appendChild($ol);

                    $fragment.appendChild($card);
                });

                $xhr.appendChild($fragment);

                const $cards = d.querySelectorAll('.card');

                $cards.forEach(card => {
                    card.addEventListener('click', handleClick);
                });
            }

        } else {
            let message = xhr.statusText || 'Ocurrió un error.';
            $xhr.innerHTML = `Error ${xhr.status}: ${message}`;
        };
    });

    xhr.open('GET', url, true);

    xhr.send();
}


function handleClick(e) {
    const $ol = e.currentTarget.querySelector('ol');
    
    if ($ol.style.display == 'flex') {
        $ol.style.display = 'none';
    } else {
        $ol.style.display = 'flex';
    }
};


function handleInputChange() {
    clearTimeout(inputTimer);
  
    inputTimer = setTimeout(sendRequest, 1000);
}


function sendRequest() {
    const inputValue = $search_by_ingredient_input.children[0].value;

    requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${inputValue}`, 'filter_cocktail', `Ingredient: ${inputValue}`);
}


function navigation(e) {
    if (e.target.matches('.navigation a')) {
        e.preventDefault();
        let letter = e.target.textContent[1];
        requests(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`, 'list_cocktails');
    }
}


function toggleItem(element, i) {
    const openItems = d.querySelectorAll('.show');
    const rotates = d.querySelectorAll('.open');
    openItems.forEach(item => {
        if (item !== element) {
            item.classList.remove('show');
        }
    });
    rotates.forEach(item => {
        if (item !== i) {
            item.classList.remove('open')
        }
    })
    i.classList.toggle('open')
    element.classList.toggle("show");
}

function toggleBtnUpVisibility() {
    const scrollY = window.scrollY;

    $btnUp.style.transition = 'opacity .5s ease'

    if (scrollY == 0) {
        $btnUp.classList.add('hidden');
        $btnUp.classList.remove('show');
    } 
    
    if (scrollY > 300) {
        $btnUp.classList.add('show');
        $btnUp.classList.remove('hidden');
    }
}

d.addEventListener('DOMContentLoaded', e => {
    
    requests('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a', 'list_cocktails', 'none');

    $search_cocktail.addEventListener('search', e => {
        location.reload();
    });

    d.querySelector('.navigation').addEventListener('click', navigation);

    $search_by_ingredient_input.addEventListener('search', e => {
        location.reload();
    });

    $search_by_ingredient_input.children[0].addEventListener('input', handleInputChange);
    
    $filter_alcoholic_link.addEventListener("click", function (event) {
        event.preventDefault();
        toggleItem($options_alcoholic, d.querySelector('.nav #filter-alcoholic i'));
        d.querySelector('.nav #filter-alcoholic i').style.transition = 'rotate .5s ease';

    });

    $filter_category_link.addEventListener("click", function (event) {
        event.preventDefault();
        toggleItem($options_category, d.querySelector('.nav #filter-category i'));
        d.querySelector('.nav #filter-category i').style.transition = 'rotate .5s ease';
    });

    $search_by_ingredient.addEventListener("click", function (event) {
        event.preventDefault();
        toggleItem($search_by_ingredient_input, d.querySelector('.nav #search-by-ingredient i'));
        d.querySelector('.nav #search-by-ingredient i').style.transition = 'rotate .5s ease';
    });

    $options_alcoholic.children[0].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=alcoholic`, 'filter_cocktail', 'Alcoholic');
    });

    $options_alcoholic.children[1].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`, 'filter_cocktail', 'Non Alcoholic');
    });

    $options_category.children[0].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Beer`, 'filter_cocktail', 'Beer');
    });

    $options_category.children[1].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Coffee_/_Tea`, 'filter_cocktail', 'Coffee / Tea');
    });

    $options_category.children[2].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocoa`, 'filter_cocktail', 'Cocoa');
    });

    $options_category.children[3].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail`, 'filter_cocktail', 'Cocktail');
    });

    $options_category.children[4].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Homemade_Liqueur`, 'filter_cocktail', 'Homemade Liqueur');
    });

    $options_category.children[5].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink`, 'filter_cocktail', 'Ordinary Drink');
    });

    $options_category.children[6].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Punch_/_Party_Drink`, 'filter_cocktail', 'Punch / Party Drink');
    });

    $options_category.children[7].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Shake`, 'filter_cocktail', 'Shake');
    });
    
    $options_category.children[8].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Shot`, 'filter_cocktail', 'Shot');
    });
    
    $options_category.children[9].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Soft_Drink`, 'filter_cocktail', 'Soft Drink');
    });
    
    $options_category.children[10].children[0].addEventListener('click', e => {
        e.preventDefault();
        requests(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Other_/_Unknown`, 'filter_cocktail', 'Other / Unknown');
    });

});


d.addEventListener('click', e => {
    if (e.target.matches('.hamburger') || e.target.matches('.hamburger *')) {
        if ($btn.classList.contains('is-active')) {
            $btn.classList.remove('is-active');   
            $nav.classList.add('translate');     
        } else {
            $btn.classList.add('is-active');
            $nav.classList.remove('translate');         
        }
    }
});


d.addEventListener('keyup', e => {
    if (e.target === $search_cocktail) {
        if (e.key === "Escape") {
            e.target.value = "";
        }

        if (e.target.value == '') {
            requests(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a`, 'list_cocktails');
        } else {
            requests(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${e.target.value}`, 'list_cocktails');
        }
        
        const $cards_search = d.querySelectorAll('.card');

        $cards_search.forEach(card => {
            card.children[1].outerText.toLowerCase().includes(e.target.value) 
            ? card.classList.remove('filter') 
            : card.classList.add('filter');
        })

    }
})


d.addEventListener('scroll', toggleBtnUpVisibility);