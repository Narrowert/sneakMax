const showMore = document.querySelector('.btn__catalog-list');
const hiddenItem = document.querySelectorAll('.catalog-item__hidden')
showMore.addEventListener("click", function(){
    hiddenItem.forEach(el =>
        el.classList.remove('catalog-item__hidden')
    )
    
    showMore.style.display = "none";
})

/* Range slider */
const rangeSlider = document.getElementById('range-slider');
if (rangeSlider) {
    noUiSlider.create(rangeSlider, {
        start: [500, 999999],
        connect: true,
        step: 1,
        range: {
            'min': [1850],
            'max': [25768]
        }
    })
}

const input0 = document.getElementById('input-0');
const input1 = document.getElementById('input-1');
const inputs = [input0, input1];

rangeSlider.noUiSlider.on('update', function(values, handle){
    inputs[handle].value = Math.round(values[handle]);
});

const setRangeSlider = (i, value) => {
    let arr = [null, null];
    arr[i] = value;

    rangeSlider.noUiSlider.set(arr);
}

inputs.forEach((el, index) => {
    el.addEventListener('change', (e)=> {
        setRangeSlider(index, e.currentTarget.value)
    })
})


/* Quiz */  

const quizData = [{
    number: 1,
    title: "Какой тип кроссовок рассматриваете?",
    answer_alias: "type",
    answers: [{
            answer_title: "кеды",
            type: "checkbox"
        },
        {
            answer_title: "кеды",
            type: "checkbox"
        },
        {
            answer_title: "кеды",
            type: "checkbox"
        },
        {
            answer_title: "кеды",
            type: "checkbox"
        },
        {
            answer_title: "кеды",
            type: "checkbox"
        },
        {
            answer_title: "кеды",
            type: "checkbox"
        }
    ]
},
{
    number: 2,
    title: "Какой размер вам подойдет?",
    answer_alias: "size",
    answers: [{
        answer_title: "менее 36",
        type: "checkbox"
    },
    {
        answer_title: "36-38",
        type: "checkbox"
    },
    {
        answer_title: "39-41",
        type: "checkbox"
    },
    {
        answer_title: "42-44",
        type: "checkbox"
    },
    {
        answer_title: "45 и больше",
        type: "checkbox"
    }
    ]
},
{
    number: 3,
    title: "Уточните какие-либо моменты",
    answer_alias: "message",
    answers: [{
        answer_title: "Введите сообщение",
        type: "textarea"
    },]
},
];

const quizTemplate = (data = [], dataLength, options) => {
	const {number, title} = data;
	const {nextBtnText} = options;
	const answers = data.answers.map(item => {
		if (item.type === 'checkbox') {
		return `
		
		<li class="quiz-questions__item">
			<img class="quiz-item__img" src="pictures/pare.jpg">
			<label class="quiz-question__label">
				<input type="${item.type}" data-valid="false" class="custom-checkbox__field" name="${data.answer_alias}" ${item.type == 'text' ? 'placeholder="Введите ваш вариант"' : ''} value="${item.type !== 'text' ? item.answer_title : ''}">
				<span class="custom-checkbox__content">${item.answer_title}</span>
			</label>
		</li>
		`;
		}
		else if (item.type === 'textarea') {
			return `
		
			<label class="quiz-question__label">
				<textarea class="quiz-question__text" placeholder="${item.answer_title}"></textarea>
			</label>
	 	`;
		}
		else {
			return `

			<label class="quiz-question__label">
				<input type="${item.type}" data-valid="false" class="quiz-question__answer" name="${data.answer_alias}" ${item.type == 'text' ? 'placeholder="Введите ваш вариант"' : ''} value="${item.type !== 'text' ? item.answer_title : ''}">
				<span>${item.answer_title}</span>
			</label>

			`;
		}
	});
	
	return `
	

		<div class="quiz-question">
			<h3 class="quiz-question__title">${title}</h3>
			<ul class="quiz-question__answers">
				${answers.join('')}
			</ul>
			<div class="quiz__questions">${number} из ${dataLength}</div>
			<button type="button" class="quiz-question__btn" data-next-btn>${nextBtnText}</button>
		</div>

	
	`;
};

class Quiz {
	constructor(selector, data, options) {
		this.$el = document.querySelector(selector);
		this.options = options;
		this.data = data;
		this.counter = 0;
		this.dataLength = this.data.length;
		this.resultArray = [];
		this.tmp = {};
		this.init();
		this.events();
	}

	init() {
		console.log('init!');
		this.$el.innerHTML = quizTemplate(quizData[this.counter], this.dataLength, this.options);
	}

	events() {
		this.$el.addEventListener('click', (e) => {
			if (e.target == document.querySelector('[data-next-btn]')) {
				this.addToSend();
				this.nextQuestion();
			}

			if (e.target == document.querySelector('[data-send]')) {
				this.send();
			}
		});

		this.$el.addEventListener('change', (e) => {
			if (e.target.tagName == 'INPUT') {
				if (e.target.type !== 'checkbox' && e.target.type !== 'radio') {
					let elements = this.$el.querySelectorAll('input');

					elements.forEach(el => el.checked = false);
				}

				this.tmp = this.serialize(this.$el);
			}
		});
	}

	nextQuestion() {
		if (this.valid()) {
			console.log('next question!');
			if (this.counter + 1 < this.dataLength) {
				this.counter++;
				this.$el.innerHTML = quizTemplate(quizData[this.counter], this.dataLength, this.options);

				// if (this.counter + 1 == this.dataLength) {
				// 	// this.$el.insertAdjacentHTML('beforeend', `<button type="button" class="quiz-question__btn" data-send>${this.options.sendBtnText}</button>`);
				// 	// this.$el.querySelector('[data-next-btn]').remove();

					
				// }
				
			}
			else {
					console.log("А все, конец!");
					document.querySelector('.quiz__content').style.display = "none";
					document.querySelector('.quiz__send').style.display = "block";
					document.querySelector('.quiz__title').textContent = "Ваша подборка готова!";
					document.querySelector('.quiz').style.border = "none";
					let quizSubtitle = document.querySelector('.quiz__subtitle');
					
					quizSubtitle.style.color = "#DBBBA9";
					quizSubtitle.textContent = "Оставьте свои контактные данные, чтобы бы мы могли отправить  подготовленный для вас каталог";
					quizSubtitle.style.borderBottom = "1px solid #DBBBA9"
				}
		}

		else{
			console.log("Не валидно!")
		}
	}

	valid() {
		let isValid = false;

		let textarea = this.$el.querySelector('textarea');

		if (textarea) {
			if (textarea.value.length > 0) {
				isValid = true;
				return isValid;
			}
		}
		

		let elements = this.$el.querySelectorAll('input');
		elements.forEach(el => {
			switch(el.type) {
				case 'text':
					(el.value) ? isValid = true : el.classList.add('error');
				case 'checkbox':
					(el.checked) ? isValid = true : el.classList.add('error');
				case 'radio':
					(el.checked) ? isValid = true : el.classList.add('error');
			}
		});

		return isValid;
	}

	addToSend() {
		this.resultArray.push(this.tmp);
	}

	send() {
		if(this.valid()) {
			console.log('send!');

			let elements = this.$el.querySelectorAll('input');
			elements.forEach(el => el.classList.remove('error'));


			const formData = new FormData();

			for(let item of this.resultArray) {
				for (let obj in item) {
					formData.append(obj, item[obj].substring(0, item[obj].length - 1))
				}
			}

			const response = fetch('mail.php', {
				method: 'POST',
				body: formData
			});
		}
	}

	serialize(form) {
		let field, s = {};
		let valueString = '';
		if (typeof form == 'object' && form.nodeName == "FORM") {
			let len = form.elements.length;
			for (let i = 0; i < len; i++) {
				field = form.elements[i];
				
				if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
					if (field.type == 'select-multiple') {
						for (j = form.elements[i].options.length - 1; j >= 0; j--) {
							if (field.options[j].selected)
								s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
						}
					} else if ((field.type != 'checkbox' && field.type != 'radio' && field.value) || field.checked) {
						valueString += field.value + ',';
						
						s[field.name] = valueString;
						
						
					}
				}
			}
		}
		return s
	}
}

window.quiz = new Quiz('.quiz .quiz__content', quizData, {
	nextBtnText: "Следующий шаг",
	sendBtnText: "Отправить"
});

/* accordeon */
document.addEventListener('DOMContentLoaded', () => {
	const accordions = document.querySelectorAll('.accordion');

	accordions.forEach(el => {
		el.addEventListener('click', (e) => {
			const self = e.currentTarget;
			const control = self.querySelector('.accordion__control');
			const content = self.querySelector('.accordion__content');

			self.classList.toggle('open');

			// если открыт аккордеон
			if (self.classList.contains('open')) {
				control.setAttribute('aria-expanded', true);
				content.setAttribute('aria-hidden', false);
				content.style.maxHeight = content.scrollHeight + 'px';
			} else {
				control.setAttribute('aria-expanded', false);
				content.setAttribute('aria-hidden', true);
				content.style.maxHeight = null;
			}
		});
	});
});

/* Mask */
$(function () {
	$("#phone").mask("(99) 999-99-99");
});

/* Burger */
const headerNav = document.querySelector('.header__nav');
const overlay = document.querySelector('.overlay');
document.querySelector('.burger').addEventListener('click', (e) => {
	e.currentTarget.classList.toggle('burger--active');
	headerNav.classList.toggle('active');
	overlay.classList.toggle('overlay--active');
});


/* Товары */
// const catalogList = document.querySelector(".catalog__list");
// let prodQuantity = 5;
// if(catalogList) {
// 	const loadProducts = (quantity = 5) => {
// 		fetch('../resources/data/data.json')
// 		.then(responce => {
// 			return responce.json();
// 		})
// 		.then(data => {
// 			console.log(data)
// 		})
// 	}

// 	loadProducts(prodQuantity)
// }
