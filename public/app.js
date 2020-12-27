const auth = firebase.auth();
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignOut = document.getElementById("whenSignedOut");
const dashboard = document.getElementById("dashboard");
const provider = new firebase.auth.GoogleAuthProvider();
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

signInBtn.addEventListener("click", () => {
	auth.signInWithPopup(provider);
});
signOutBtn.addEventListener("click", () => {
	auth.signOut();
});

auth.onAuthStateChanged((user) => {
	if (user) {
		whenSignOut.hidden = true;
		whenSignedIn.hidden = false;
		dashboard.hidden = false;
		adminLogedin();
	} else {
		whenSignOut.hidden = false;
		whenSignedIn.hidden = true;
		dashboard.hidden = true;
	}
});
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

	monthlySalesGraph(categories, data);
};
const monthlySalesGraph = (categories, data) => {
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
