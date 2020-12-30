const db = firebase.firestore();
const itemsRef = db.collection("items");
const auth = firebase.auth();
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const saveItemBtn = document.getElementById("saveItemBtn");
const itemNameInpt = document.getElementById("itemNameInpt");
const itemDescInpt = document.getElementById("itemDescInpt");
const itemCostInpt = document.getElementById("itemCostInpt");
const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignOut = document.getElementById("whenSignedOut");
const dashboard = document.getElementById("dashboard");
const inventory = document.getElementById("inventory");
const cashRegister = document.getElementById("cashRegister");
const itemCardContainer = document.getElementById("itemCardContainer");
const provider = new firebase.auth.GoogleAuthProvider();
var itemsArray = [];
const month = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const colors = ["#ff66ff"];

auth.onAuthStateChanged((user) => {
	if (user) {
		whenSignOut.hidden = true;
		whenSignedIn.hidden = false;
		dashboard.hidden = false;
		inventory.hidden = false;
		cashRegister.hidden = false;
		adminLogedin();

		signInBtn.addEventListener("click", () => {
			auth.signInWithPopup(provider);
		});
		signOutBtn.addEventListener("click", () => {
			auth.signOut();
		});
		saveItemBtn.addEventListener("click", () => {
			let itemName = itemNameInpt.value;
			let itemDesc = itemDescInpt.value;
			let itemCost = itemCostInpt.value;
			itemsRef
				.add({
					item_name: itemName,
					item_desc: itemDesc,
					item_cost: parseFloat(itemCost),
				})
				.then(function (docRef) {
					alert("New item saved: " + itemName);
					itemNameInpt.value = "";
					itemDescInpt.value = "";
					itemCostInpt.value = "";
				})
				.catch(function (error) {
					console.log(error);
				});
		});
	} else {
		whenSignOut.hidden = false;
		whenSignedIn.hidden = true;
		dashboard.hidden = true;
		inventory.hidden = true;
		cashRegister.hidden = true;
	}
});

// render admin pages
const adminLogedin = () => {
	// get the last five months with the current month
	const categories = [];
	const data = [];
	const currentMonth = new Date().getMonth();
	for (let i = 5; i > 0; i--) {
		categories.push(month[currentMonth - i]);
	}
	categories.push(month[currentMonth]);

	// get the data for the last five months with the current month
	for (let i = 0; i < 6; i++) {
		data.push(Math.floor(Math.random() * 300) + 100);
	}
	// jumbotron graph render
	monthlySalesGraphRender(categories, data);
	// list of items card render

	itemsRef.onSnapshot((querySnapshot) => {
		const item = querySnapshot.docs.map((doc) => {
			const name = doc.data().item_name;
			const desc = doc.data().item_desc;
			const cost = doc.data().item_cost;
			itemsArray.push({ name, desc, cost });
		});
		itemCardListRender(itemsArray);
	});
};
const itemCardListRender = (arr) => {
	const itemCardList = arr.map((item) => {
		const name = item.name;
		const desc = item.desc;
		const cost = item.cost;
		return `<div class="itemCard"><p>${name}</p><p>${desc}</p><p>₱${cost}</p></div>`;
	});
	itemCardContainer.innerHTML = itemCardList.join("");
};
const monthlySalesGraphRender = (categories, data) => {
	var options = {
		series: [
			{
				name: "Sales",
				data: data,
			},
		],
		chart: {
			height: 300,
			margin: 5,
			type: "bar",
			toolbar: { tools: { download: false } },
			events: {
				click: function (chart, w, e) {
					// console.log(chart, w, e)
				},
			},
		},
		colors: colors,
		plotOptions: {
			bar: {
				columnWidth: "45%",
				distributed: true,
			},
		},
		title: {
			text: "monthly sales",
			align: "center",
			style: {
				fontSize: "14px",
				fontFamily: "Oswald",
				color: "#263238",
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		xaxis: {
			categories: categories,
			labels: {
				style: {
					colors: "#000",
					fontSize: "12px",
				},
			},
		},
	};

	var chart = new ApexCharts(document.getElementById("chart"), options);
	chart.render();
};
