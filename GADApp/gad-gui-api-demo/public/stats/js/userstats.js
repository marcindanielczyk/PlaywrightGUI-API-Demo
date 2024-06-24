const userstatsEndpoint = "../../api/stats/users";
let results;

async function issueGetRequest() {
  // get data from the server:
  results = await Promise.all(
    [userstatsEndpoint].map((url) => fetch(url + `?chartType=${chartType}`).then((r) => r.json()))
  );

  return results;
}

const displayData = () => {
  const articlesDataForChart = results[0]["articlesDataForChart"];
  const commentsDataForChart = results[0]["commentsDataForChart"];
  const userIdToName = results[0]["userIdToName"];
  const articlesPerUser = results[0]["articlesPerUser"];
  const commentsPerUser = results[0]["commentsPerUser"];

  let articlesOptions;
  let commentsOptions;
  let articlesChart;
  let commentsChart;
  let typeIsCharts = false;
  let typeIsTable = false;

  if (chartType === "pie") {
    articlesChart = new google.visualization.PieChart(document.getElementById("articlesPerUserChart"));
    commentsChart = new google.visualization.PieChart(document.getElementById("commentsPerUserChart"));

    articlesOptions = {
      title: "Number of articles",
      width: 400,
      height: 400,
      vAxis: {
        minValue: 0,
        format: "0",
      },
      legend: { position: "left", textStyle: { fontSize: 10 } },
    };
    commentsOptions = {
      title: "Number of comments",
      width: 400,
      height: 400,
      vAxis: {
        minValue: 0,
        format: "0",
      },
      legend: { position: "left", textStyle: { fontSize: 10 } },
    };
    articlesOptions.chartArea = { left: 20, right: 20, top: 40, bottom: 20 };
    commentsOptions.chartArea = { left: 20, right: 20, top: 40, bottom: 20 };
    typeIsCharts = true;
  } else if (chartType === "table") {
    typeIsTable = true;
  } else {
    articlesChart = new google.visualization.ColumnChart(document.getElementById("articlesPerUserChart"));
    commentsChart = new google.visualization.ColumnChart(document.getElementById("commentsPerUserChart"));

    articlesOptions = {
      title: "Number of articles",
      width: 400,
      height: 400,
      vAxis: {
        minValue: 0,
        format: "0",
      },
      legend: { position: "none" },
    };
    commentsOptions = {
      title: "Number of comments",
      width: 400,
      height: 400,
      vAxis: {
        minValue: 0,
        format: "0",
      },
      legend: { position: "none" },
    };
    typeIsCharts = true;
  }

  if (typeIsCharts) {
    // Doc: https://developers.google.com/chart/interactive/docs/gallery/columnchart?hl=pl
    const articlesDataTable = google.visualization.arrayToDataTable(articlesDataForChart);
    const commentsDataTable = google.visualization.arrayToDataTable(commentsDataForChart);

    articlesChart.draw(articlesDataTable, articlesOptions);
    commentsChart.draw(commentsDataTable, commentsOptions);

    document.querySelector("#btnDownloadArticlesDataCsv").onclick = () => {
      download("articles_data.csv", articlesDataForChart);
    };
    document.querySelector("#btnDownloadCommentsDataCsv").onclick = () => {
      download("comments_data.csv", commentsDataForChart);
    };
    document.querySelector("#btnDownloadArticlesDataJson").onclick = () => {
      download("articles_data.json", articlesDataForChart);
    };
    document.querySelector("#btnDownloadCommentsDataJson").onclick = () => {
      download("comments_data.json", commentsDataForChart);
    };
    document.querySelector("#btnDownloadArticlesDataCsv").disabled = false;
    document.querySelector("#btnDownloadCommentsDataCsv").disabled = false;
    document.querySelector("#btnDownloadArticlesDataJson").disabled = false;
    document.querySelector("#btnDownloadCommentsDataJson").disabled = false;
    document.querySelector("#tableChart").style.visibility = "visible";
    document.querySelector("#tableArea").style.visibility = "collapse";
  }
  if (typeIsTable) {
    const sortedArticlesPerUser = Object.entries(articlesPerUser)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ userId: parseInt(key), value }));

    const tableDataForCsv = [["User", "Articles", "Comments"]];
    const tableElement = document.getElementById("tableDataBody");
    for (const keyValuePair of sortedArticlesPerUser) {
      const user_id = keyValuePair.userId;
      let userName = userIdToName[user_id];
      let userLink = `<a href="/user.html?id=${user_id}">${userName}</a>`;
      let articlesCount = articlesPerUser[user_id] ?? 0;
      let commentsCount = commentsPerUser[user_id] ?? 0;
      tableElement.innerHTML += `<tr><td data-testid="user-${user_id}" style="text-align: center">${userLink}</td>
                <td data-testid="articles-count-${user_id}" style="text-align: center">${articlesCount}</td>
                <td data-testid="comments-count-${user_id}" style="text-align: center">${commentsCount}</td></tr>`;
      tableDataForCsv.push([userName, articlesCount, commentsCount]);
    }
    document.querySelector("#tableArea").style.visibility = "visible";
    document.querySelector("#tableChart").style.visibility = "collapse";
    document.querySelector("#btnDownloadTableDataCsv").onclick = () => {
      download("user_table_data.csv", tableDataForCsv);
    };
    document.querySelector("#btnDownloadTableDataJson").onclick = () => {
      download("user_table_data.json", tableDataForCsv);
    };
    document.querySelector("#btnDownloadTableDataXlsx").onclick = () => {
      downloadXlsx("user_table_data.xlsx", tableDataForCsv);
    };
    document.querySelector("#btnDownloadTableDataCsv").disabled = false;
    document.querySelector("#btnDownloadTableDataJson").disabled = false;
    document.querySelector("#btnDownloadTableDataXlsx").disabled = false;
  }
};

function generateChartPDF(filename) {
  generatePDF(filename, "tableChart");
}

function displayChart(chartId, xLabels, data, title) {
  if (window.myCharts === undefined) {
    window.myCharts = {};
  }

  if (window.myCharts[chartId] != undefined) {
    window.myCharts[chartId].destroy();
  }

  const ctx = document.getElementById(chartId).getContext("2d");
  window.myCharts[chartId] = new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: xLabels,
      datasets: [{ data: data }],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 24,
          },
        },
      },
    },
  });
}

function displayCanvasChart(results, title) {
  document.querySelector("#canvasPolarChartData").style.display = "inherit";

  const xLabels = [];
  const articlesData = [];
  results.forEach((element) => {
    if (typeof element[1] === "number") {
      xLabels.push(element[0]);
      articlesData.push(element[1]);
    }
  });

  displayChart("canvasPolarChartData", xLabels, articlesData, title);
}

// Load google charts
google.charts.load("current", { packages: ["corechart"] });

const chartType = getParams()["type"];
const entityType = getParams()["e"];

if (chartType === "polar") {
  issueGetRequest().then((results) => {
    if (entityType === "articles") {
      displayCanvasChart(results[0].articlesDataForChart, "Articles per User");
    } else if (entityType === "comments") {
      displayCanvasChart(results[0].commentsDataForChart, "Comments per User");
    } else {
      displayCanvasChart([], `No data for: ${entityType}`);
    }
  });
} else {
  issueGetRequest().then(() => {
    google.charts.setOnLoadCallback(displayData);
  });
}
