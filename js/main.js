import { initDOU } from './products/dou/index.js';
import { initSchool } from './products/school/index.js';
import { initSPO } from './products/spo/index.js';
import { initAdditional } from './products/additional/index.js';
import { pageTitles, pageSubtitles } from './config/constants.js';

function getCurrentProduct() {
    const activeForm = document.querySelector('.form-container.active');
    if (activeForm) {
        if (activeForm.id === 'douForm') return 'dou';
        if (activeForm.id === 'schoolForm') return 'school';
        if (activeForm.id === 'spoForm') return 'spo';
        if (activeForm.id === 'udoForm') return 'udo';
    }
    return 'dou';
}

function switchForm(formId) {
    const navLinks = document.querySelectorAll('.nav-link');
    const formContainers = document.querySelectorAll('.form-container');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    navLinks.forEach(link => {
        if (link.getAttribute('data-form') === formId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    formContainers.forEach(container => {
        if (container.id === `${formId}Form`) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    });

    if (pageTitles[formId]) {
        pageTitle.textContent = pageTitles[formId];
        pageSubtitle.textContent = pageSubtitles[formId];
    }

    localStorage.setItem('selectedForm', formId);

    // Инициализируем соответствующий продукт
    initCurrentProduct(formId);
}

function initCurrentProduct(productType) {
    switch(productType) {
        case 'dou':
            initDOU();
            break;
        case 'school':
            initSchool();
            break;
        case 'spo':
            initSPO();
            break;
        case 'udo':
            initAdditional();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchForm(this.getAttribute('data-form'));
        });
    });

    const savedForm = localStorage.getItem('selectedForm') || 'dou';
    switchForm(savedForm);
});