'use strict';

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    console.log(event);
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }
    /* add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log('articleSelector', articleSelector);
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log('targetArticle', targetArticle);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    for (let article of articles) {
        /* get the article id */
        const articleId = article.getAttribute('id');
        /* find the title element */
        const titleElement = article.querySelector(optTitleSelector);
        /* get the title from the title element */
        const articleTitle = titleElement.innerHTML;
        /* create HTML of the link */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        /* insert link into titleList */
        titleList.insertAdjacentHTML('beforeend', linkHTML);
    }
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}

function generateTags(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles) {
        /* find tags wrapper */
        const tagList = article.querySelector(optArticleTagsSelector);
        let html = '';
        const articleTags = article.getAttribute('data-tags');
        console.log('articleTags = ', articleTags);
        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        console.log('articleTagsArray = ', articleTagsArray);
        /* START LOOP: for each tag */
        for (let tag of articleTagsArray) {
         /* generate HTML of the link */  
         /* add generated code to html variable */
            html = html + '<li><a href="#tag-'+ tag + '">' + tag + '</a></li>' + '\n';
            console.log('html = ', html);
        }
        /* END LOOP: for each tag */
        /* insert HTML of all the links into the tags wrapper */
        tagList.insertAdjacentHTML('beforeend', html);
       /* END LOOP: for every article: */ 
    }
}

function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    console.log('clickedElement =', clickedElement);
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    console.log('href=', href);
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    console.log('tag=', tag);
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    console.log('activeTagLinks', activeTagLinks);
    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');
     } 
    /* END LOOP: for each active tag link */
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinksWithHref = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let tagLinkWithHref of tagLinksWithHref) {
      /* add class active */
      tagLinkWithHref.classList.add('active');
    }
    /* END LOOP: for each found tag link */
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
    /* find all links to tags */
    const links = document.querySelectorAll('.post-tags a');
    console.log(links);
    /* START LOOP: for each link */
    for (let link of links) {
        /* add tagClickHandler as event listener for that link */
        link.addEventListener('click', tagClickHandler);
  
    /* END LOOP: for each link */
    }
}
    
function generateAuthors(){
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles) {
        const authorWrapper = article.querySelector(optArticleAuthorSelector);
        const author = article.getAttribute('data-author');
        const html = 'by <a href="#author-' + author +'">' + author + '</a>';
        authorWrapper.innerHTML = html;
    }
    
}

function authorClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    console.log('activeAuthorLinks', activeAuthorLinks);
    for (let activeAuthorLink of activeAuthorLinks) {
        activeAuthorLink.classList.remove('active');
    } 
    const authorLinksWithHref = document.querySelectorAll('a[href="' + href + '"]');
    for (let authorLinkWithHref of authorLinksWithHref) {
        authorLinkWithHref.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
    const links = document.querySelectorAll('.post-author a');
    console.log('Author links', links);
    for (let link of links) {
        link.addEventListener('click', authorClickHandler);
    }
}

generateTitleLinks();
generateTags();
generateAuthors();
addClickListenersToTags();
addClickListenersToAuthors();
