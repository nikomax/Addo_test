/**
 * Created by maksc on 11.09.2017.
 */
var xhr = new XMLHttpRequest();
var gallery = document.querySelector(".gallery");
var pagination = document.querySelector(".pagination");
var size = document.querySelector(".size");
var preview = document.querySelector(".overlay");
var previewImg = document.querySelector(".preview__img");

function chunk(arr, size) {
    var result = [];
    for (var j = 0; j < arr.length; j += size) {
        result.push(arr.slice(j, j + size));
    }
    return result;
}

function createPage(arr) {
    for (var n = 0; n < arr.length; n++) {
        var page = document.createElement('li');
        page.classList.add('page__item');
        page.innerHTML = `<a class="page__link" href=${n}>${n + 1}</a>`;
        pagination.appendChild(page);
    }
}

function showDefaultImg(arr) {
    for (var j = 0; j < arr[0].length; j++) {
        var attr = 'https://unsplash.it/200?image=' + arr[0][j];
        var newImg = document.createElement('div');
        newImg.classList.add('gallery__item');
        newImg.innerHTML = `<a class="gallery__link" href="#"><img class="gallery__img" src=${attr}></a>`;
        gallery.appendChild(newImg);
    }
}

function active(el) {
    if (selected) {
        selected.classList.remove('selected');
    }
    selected = el;
    selected.classList.add('selected');
}

var selected = null;
function showImg(arr)  {
    event.preventDefault();
    var target = event.target;
    if (target.classList.value != 'page__link') return;
    gallery.innerHTML = '';
    active(target);
    var pageNum = target.getAttribute('href');
    for (var j = 0; j < arr[pageNum].length; j++) {
        var attr = 'https://unsplash.it/200?image=' + arr[pageNum][j];
        var newImg = document.createElement('div');
        newImg.classList.add('gallery__item');
        newImg.innerHTML = `<a class="gallery__link" href="#"><img class="gallery__img" src=${attr}></a>`;
        gallery.appendChild(newImg);
    }
}

function heightCondition (a, minHeight, maxHeight) {
    if (a.height > minHeight && a.height < maxHeight) {
        arrId.push(a.id);
    }
}

xhr.open('GET', 'https://unsplash.it/list', false);

xhr.send();

if (xhr.status != 200) {

    alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
} else {
    var data = JSON.parse(xhr.response);
    var arrId = [];
    for (var i = 0; i < data.length; i++) {
        arrId.push(data[i].id);
    }
    var chunkedArr = chunk(arrId, 20);
    createPage(chunkedArr);

    showDefaultImg(chunkedArr);

    pagination.onclick = function (event) {
        showImg(chunkedArr);
    };

    size.onclick = function (event) {
        var targetLarge = event.target;
        console.log(targetLarge);
        if (targetLarge.getAttribute('name') != 'size') return;
        var large = targetLarge.classList.value;
        gallery.innerHTML = '';
        pagination.innerHTML = '';
        arrId = [];
        for (var i = 0; i < data.length; i++) {
            if (large === 'small') {
                heightCondition (data[i], 0, 799);
            } else if (large === 'medium') {
                heightCondition (data[i], 800, 1500);
            } else if (large === 'large') {
                heightCondition (data[i], 1500, Infinity);
            }
        }

        chunkedArr = chunk(arrId, 20);

        createPage(chunkedArr);

        showDefaultImg(chunkedArr);

        pagination.onclick = function (event) {
            showImg(chunkedArr);
        }
    };

    gallery.onclick = function (event) {
        event.preventDefault();
        var target = event.target;
        if (target.classList.value != 'gallery__img') return;
        preview.style.display="block";
        var imageSrc = target.getAttribute('src');
        var imageId = imageSrc.substr(30);
        previewImg.setAttribute('src', 'https://unsplash.it/1000/600?image=' + imageId);
        preview.onclick = function () {
            preview.style.display="none";
        }
    }
}