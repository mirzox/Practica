let send = document.querySelector(".form_send");
let form1 = document.querySelector("#form1");
let inputs = form1.querySelectorAll("input");
let formCap = document.querySelector('#team_member_4')
let form2 = document.querySelector("#form2");
let num = document.getElementById('num')
const script=document.querySelector('script[src="index.js"]')
const fileInput = document.getElementById('file-input');

const url = "http://185.217.131.217/api/v1/";
const urlContest = url + "contest/";
const urlCommand = url + "command/";
const urlParticipant = url + 'participant/'
const title = document.body.querySelector('h1')

let resultPost;
let checkPost = false;

const getRequest = (urlRequest, url404) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", urlRequest, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            // console.log(title)
            title.innerText = response[0].h

            // console.log(response[0].a);
            if (response[0]["a"] === true) {
                return response;
            } else {
                console.log("Результат - false");
                window.localStorage(url404);
            }
        }
    };
    xhr.send();
};

const postRequest = async (urlRequest, data) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        data = JSON.stringify(data);
        xhr.open("POST", urlRequest, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 201) {
                resultPost = JSON.parse(xhr.responseText);
                checkPost = true;
                resolve(resultPost);
            } else {
                checkPost = false;
                resultPost = JSON.parse(xhr.responseText);
                reject(resultPost);
            }
        };
        xhr.send(data);
        // try {
        //     var data1 = JSON.parse(resultPost);
        //     // Дальнейшие действия с объектом data
        // } catch (e) {
        //     if (e instanceof SyntaxError) {
        //         console.error('Ошибка разбора JSON:', e.message);
        //     } else {
        //         console.error('Неизвестная ошибка:', e.message);
        //     }
        // }
        // return resultPost
    });
};


document.addEventListener("DOMContentLoaded", (e) => {
    // console.log(e)


    getRequest(urlContest, 'F:/TUIT/4-kurs/pre-diploma/soliq/konkurs404/konkurs.fiin.uz');
    let storageCheck = JSON.parse(window.localStorage.getItem('form1'))

    if (storageCheck) {
        for (let i = 0; i < Object.keys(storageCheck).length; i++) {
            let smth = document.querySelector(`input[data-id='${Object.keys(storageCheck)[i]}']`)
            if (smth !== null) {
                smth.value = Object.values(storageCheck)[i]
            }
        }
    }


});

const inputSelect = (arrRequest, arrAutoComplete = {}) => {
    let arrInputs = [];
    arrRequest.forEach((elem) => {
        let tag = document.querySelector(`input[data-id='${elem}']`);

        if (tag !== null && tag.value !== "") {
            arrInputs.push(tag.value);
        } else {

            // if (arrAutoComplete[`${elem}`]!=={}){
            //     tag.value=arrAutoComplete[`${elem}`]
            // }else
            arrInputs.push("not pressed");
        }
    });
    return Object.fromEntries(arrRequest.map((elem, i) => [elem, arrInputs[i]]));
};

const inputError = (arrError) => {
    let tagErr
    let listError = (Object.keys(arrError))
    console.log(arrError)
    if (listError.length !== 0) {
        listError.forEach(elem => {
            let value = arrError[`${elem}`]
            let tag = document.querySelector(`input[data-id='${elem}']`);

            if (checkPost) {
                if (tag.parentElement.nextElementSibling === null) {
                    let tagType = document.createElement("p")
                    tagType.innerText = value
                    tagType.className = 'inputError'
                    tagErr = tag.parentElement.insertAdjacentElement('afterend', tagType)
                } else if (tag.parentElement.nextElementSibling !== null && tag.parentElement.nextElementSibling.innerHTML !== `<p>${value}</p>`) {
                    tag.parentElement.nextElementSibling.innerHTML = `<p class="inputError">${value}</p>`
                }
            }
        }
        )
    }
    return tagErr
}

const checkInputValue = (arrRequest) => {
    let check = false;
    arrRequest.forEach((elem) => {
        let tag = document.querySelector(`input[data-id='${elem}']`);
        check = tag !== null &&
            tag.value !== "" &&
            tag.value !== undefined;
    });
    return check;
};

form1.addEventListener("submit", (e) => {
    e.preventDefault();


    let jsonFromBack = [
        "c_mail",
        "consult",
        "m_count",
        "mail",
        "motto",
        "name",
        "passport",
        "phone",
    ];

    if (checkInputValue(jsonFromBack) === false) {
        alert('Please write all Inputs')
    } else {

        let data = inputSelect(jsonFromBack);
        // console.log(data)
        data["contest_id"] = 1;
        postRequest(urlCommand, data).then((resultPost, checkPost) => {
            if (checkPost === false) {
                inputError(resultPost)
            }
            if (checkPost) {

            }

        }).catch(e => {
            if (checkPost !== false) {
                inputError(resultPost)
            } else {
                form1.style.display = 'none'
                localStorage.setItem("form1", JSON.stringify(resultPost));
                let team_info = {
                    command_id: resultPost['c_id'],
                    m_count: resultPost.m_count
                }
                localStorage.setItem("team_info", JSON.stringify(team_info));
            }

            // console.log(Object.values(e))
            // console.log(checkPost);


            // console.log(checkPost, 'OKEY');
        })


        form1.style.display = 'none'
        formCap.style.display = 'block'
        form1.lastChild.remove()
    }
});



function iinians(prevForm, form2) {
    form2.addEventListener("submit", (e) => {
        e.preventDefault();


        let jsonFromBack = [
            "command_id",
            "firstname",
            "lastname",
            "secondname",
            "photo",
            "mail",
            'gender',
            'uni_name',
            'faculty',
            'degree',
            'course',
            "interests",
            "is_capitan",
            "passport",
            "phone",
        ];

        if (checkInputValue(jsonFromBack) === false) {
            alert('Please write all Inputs')
        } else {

            let data = inputSelect(jsonFromBack);
            // console.log(data)
            data["command_id"] = JSON.parse(window.localStorage.getItem('team_info')).command_id;
            let file = data["photo"];

            const formData = new FormData();

            formData.append('is_captain', true)




            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value)
            }
            console.log(fileInput)
            console.log(fileInput[0])

            formData.append('photo', fileInput.files[0]);
            // data['photo'] = formData
            formData.append('command_id',JSON.parse(window.localStorage.getItem('team_info')).command_id);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', urlParticipant);
            xhr.send(formData);

            postRequest(urlParticipant, formData).then((resultPost, checkPost) => {
                if (checkPost === false) {
                    inputError(resultPost)
                }
                if (checkPost) {

                }

            }).catch(e => {
                console.log(checkPost)
                if (checkPost === false) {
                    inputError(resultPost)
                } else {
                    form2.style.display = 'none'
                    prevForm.style.display = 'block'
                    form2.lastChild.remove()
                    localStorage.setItem("form2", JSON.stringify(resultPost));
                    let team_info = {
                        command_id: resultPost['c_id'],
                        m_count: resultPost.m_count
                    }
                    localStorage.setItem("team_info", JSON.stringify(team_info));
                }

                // console.log(Object.values(e))
                console.log(checkPost);


                // console.log(checkPost, 'OKEY');
            })


            form2.style.display = 'none'
            prevForm.style.display = 'block'
            form2.lastChild.remove()
        }
    });
}
let membersCount=JSON.parse(window.localStorage.getItem('team_info')).m_count
if (membersCount.value > 1) {
    let i = membersCount.value;
    while (i <= membersCount) {
        const section = document.createElement('section');
        section.textContent = `Section ${i}`;
        document.body.appendChild(section);
        i++;
    }
}


let jsonFromBack = [
    "firstname",
    "lastname",
    "secondname",
    "photo",
    "mail",
    'gender',
    'uni_name',
    'faculty',
    'degree',
    'course',
    "interests",
    "passport",
    "phone",
];
let memberForms = (arr, num) => {
    let htmlElems = []
    console.log('done')
    for (let i = 2; i <= num; i++) {
        // let isCap=''
        // if (i===1){
        //     isCap=', капитан команды'
        // }
        let sec=document.createElement('section')
            sec.className="team_member"
        sec.id=`team_member_${i}`
        let elem = `
            
        <div class="container">
            <div class="form">
                <form id="form${i+1}" action="" method="post" class="">
                <div class="block_form">
                        <div class="header_form">

                            <div class="tag_form peaople_title">
                                Участник ${i}
                            </div>
                        </div>
                    </div>
                    ${
            arr.map(e=>(
                `<div class="block_form">
                        <div class="header_form">

                            <div class="tag_form">
                                ${e}:
                            </div>
                        </div>
                        <div>
                            <div class="input_form place_input">
                                <input required type="${e}" placeholder="${e}" data-id="${e}">
                            </div>
                        </div>
                        <hr class="form_hr">
                    </div>
`
            ))
        }

                    <input class="form_send" type="submit" value="Send">
                </form>
            </div>
        </div>

        `
        sec.innerHTML=elem
        script.insertAdjacentElement('beforebegin', sec)
        htmlElems.push(sec)
    }
    return htmlElems
}

let others=memberForms(jsonFromBack, membersCount)
for (let i=0; i<others; i++){
    iinians(others[i], others[i-1])}




form2.addEventListener("submit", (e) => {
    e.preventDefault();


    let jsonFromBack = [
        "command_id",
        "firstname",
        "lastname",
        "secondname",
        "photo",
        "mail",
        'gender',
        'uni_name',
        'faculty',
        'degree',
        'course',
        "interests",
        "is_capitan",
        "passport",
        "phone",
    ];

    if (checkInputValue(jsonFromBack) === false) {
        alert('Please write all Inputs')
    } else {

        let data = inputSelect(jsonFromBack);
        // console.log(data)
        data["command_id"] = JSON.parse(window.localStorage.getItem('team_info')).command_id;
        let file = data["photo"];

        const formData = new FormData();

        formData.append('is_captain', true)




        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value)
        }
        console.log(fileInput)
        console.log(fileInput[0])

        formData.append('photo', fileInput.files[0]);
        // data['photo'] = formData
        formData.append('command_id',JSON.parse(window.localStorage.getItem('team_info')).command_id);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', urlParticipant);
        xhr.send(formData);

        postRequest(urlParticipant, formData).then((resultPost, checkPost) => {
            if (checkPost === false) {
                inputError(resultPost)
            }
            if (checkPost) {

            }

        }).catch(e => {
            console.log(checkPost)
            if (checkPost === false) {
                inputError(resultPost)
            } else {
                form1.style.display = 'none'
                formCap.style.display = 'block'
                form1.lastChild.remove()
                localStorage.setItem("form2", JSON.stringify(resultPost));
                let team_info = {
                    command_id: resultPost['c_id'],
                    m_count: resultPost.m_count
                }
                localStorage.setItem("team_info", JSON.stringify(team_info));
            }

            // console.log(Object.values(e))
            console.log(checkPost);


            // console.log(checkPost, 'OKEY');
        })


        form2.style.display = 'none'
        document.querySelector('#team_member_2').style.display = 'block'
        form2.lastChild.remove()
    }
});

for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i]
    input.addEventListener('click', () => {
        if (input.parentElement === null) {
            input.parentElement.nextElementSibling.remove()
        }
    })
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            input.blur()
        }
    })
}



const selectedOption = document.querySelector('input[name="gender"]:checked')
const formDatas = new FormData();
formDatas.append('radio',selectedOption.value);
const xhr = new XMLHttpRequest()
xhr.open('POST',url)
xhr.send(formDatas)
console.log(selectedOption.value)