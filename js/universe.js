// Load data from API
const cardContainer = document.getElementById("card-container");
const loadData = async () => {
    const url = "https://openapi.programming-hero.com/api/ai/tools";
    const res = await fetch(url);
    const data = await res.json();

    return data.data.tools;
};
window.addEventListener("load", () => {
    loadData().then((data) => {
        displayData(data.slice(0, 6));
    });
});
// Display Data from API
const displayData = (data) => {
    data.forEach((item) => {
        cardContainer.innerHTML += card(item);
    });
};
// Making dinamic card and display data
const card = (item) => {
    const features = `${item.features
        .map((feature) => `<li>${feature}</li>`)
        .join("")}`;


    return `
    <div class="card lg:w-96 bg-base-100 w-[95%] mx-auto  shadow-xl">
    <figure><img class="lg:h-[300px] lg:w-[437px]" src="${item.image}"/></figure>
    <div class="card-body">
        <h4 class="text-2xl font-semibold">Features</h4>
        <div class="text-[#585858]">
        
        <ol id="features-ol"> ${features} </ol>
        </div>
        <hr class=" border-1">
        <div class="flex justify-between items-center">
            <div class="space-y-4">
                <h2 id="title" class="card-title">${item.name}</h2>
                <div id="date-container" class="text-[#585858]"><i class="fa-solid fa-calendar-days"></i> ${item.published_in}
                </div>
            </div>
            <div class="">
                <label onclick="showFeatureItem('${item.id}')" for="my-modal-5" class="text-[#EB5757] bg-[#FEF7F7] px-4 py-3 rounded-full"><i class="fa-solid fa-arrow-right"></i></label>
            </div>
        </div>
    </div>
</div>
    `;

};
// Button for load more data
const seeMore = document.getElementById("see-more-btn");
seeMore.addEventListener("click", () => {
    loadData().then((data) => {
        displayData(data.slice(6, 12));
        seeMore.remove();
    });
});

// Button for sort data by date
const sortBtn = document.getElementById("sort-btn");
sortBtn.addEventListener("click", () => {
    loadData().then((data) => {
        const sortedData = data.sort(
            (a, b) => new Date(a.published_in) - new Date(b.published_in)
        );
        cardContainer.innerHTML = "";
        displayData(sortedData);
        seeMore.remove();
    });
});

// create and display modal
const modalWrapper = document.querySelector(".modal-wrapper");
const showFeatureItem = (id) => {
    modalWrapper.innerHTML = `
    <input type="checkbox" id="my-modal-5" class="modal-toggle" />
    <div class="modal modal-middle ">
    <div class="modal-box w-11/12 max-w-5xl h-full">
    <div class=" flex lg:flex-row flex-col-reverse gap-10" >
    <div id="tool-description" class=" lg:max-w-[50%]"> </div>
    <div id="tool-card"></div>
    </div>
    
    <div class="modal-action bottom-12">
        <label for="my-modal-5" class="btn">Close</label>
        </div>
        
    </div>
    </div>
    `;
    const toolDescription = document.getElementById("tool-description");
    const toolCard = document.getElementById("tool-card");

    console.log({
        id,
    });

    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then(({ data }) => {

            console.log(data)
            const featureList = Object.keys(data.features)
                .map((item) => {
                    const { feature_name } = data.features[item];
                    return `<li> ${feature_name} </li>`;
                })
                .join(" ");



            const pricing = data?.pricing?.length > 0 ?
                data.pricing?.map((item) => `
                <div id="price" class=" bg-white p-5 flex items-center flex-col justify-center font-semibold  ">
                   <div>  ${item?.plan} </div>
                   <div>  ${item?.price} </div>
                </div>
            `).join("") : `
            <div id="price" class=" bg-white p-5 flex items-center flex-col justify-center font-semibold  ">
            <div><h2>Basic</h2></div>
            <div>Free of cost</div>
         </div>
            <div id="price" class=" bg-white p-5 flex items-center flex-col justify-center font-semibold  ">
            <div><h2>Pro</h2></div>
            <div>Free of cost </div>
         </div>
            <div id="price" class=" bg-white p-5 flex items-center flex-col justify-center font-semibold  ">
            <div><h2>Enterrise</h2></div>
            <div>Free of cost</div>
         </div>
            `;

            const integrations = data.integrations?.map((item) => `
            <li>${item}</li>
            
            `).join(' ');




            toolDescription.innerHTML = `
            <div class="card bg-base-100 border-2 border-[#EB5757] bg-[#FEF7F7] p-5 lg:h-[611px] ">
                <h4 class="text-xl font-semibold"> ${data.description} </h4>
            <div>
                <div id="pricing-div" class="grid grid-cols-3 gap-3 mt-16 ">
                ${pricing}
                    </div >
            </div >
    <div class="lg:flex flex-1 justify-between mt-16 ">
        <div>
            <h4 class="text-2xl font-semibold">Features</h4>
            ${featureList} </div>
        <div>

            <h4 class="text-2xl font-semibold" > Integration </h4>
            ${data.integrations ?

                    ` 
                    ${integrations}
                </div > `
                    : "No data Found"
                }

        </div >
    </div > `;

            toolCard.innerHTML = `
            <div class="card bg-base-100 lg:h-[611px] shadow-xl" >

            ${data.accuracy?.score
                    ? `
                    <div class="px-2 py-1 mx-auto bg-[#EB5757]  rounded-md relative lg:top-12 lg:left-36 left-16 top-40 ">
                    <h3 class="px-2 py-1 text-white font-medium">${data?.accuracy?.score * 100
                    }% accuracy</h3>
                    </div>
                  `
                    : " "
                }
                 
                    <figure><img class="lg:h-[300px] lg:w-[437px] rounded-xl " src="${data?.image_link[0]
                }"/></figure>
                        <div class="card-body">
                            <h4 class="text-2xl font-semibold"> ${data?.input_output_examples
                    ? data.input_output_examples[0]?.input
                    : ""
                } </h4>
                            <div class="text-[#585858]">
                            ${data?.input_output_examples
                    ? data?.input_output_examples[0].output
                    : ""
                }
                            </div>
                        </div>
                    </div >
                    </div>
    `;
        })
        .catch((err) => {
            console.log(err);
        });
};