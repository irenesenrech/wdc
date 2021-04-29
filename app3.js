var str_value = "";
(function () {
  var myConnector = tableau.makeConnector();
  myConnector.getSchema = function (schemaCallback) {
    const cols = [
      {
        id: "lastupdatedate",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "type",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "id",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "datetime",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "percentage",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "value",
        dataType: tableau.dataTypeEnum.float,
      },
    ];

    let apiTableSchema = {
      id: "APIDATOS",
      alias: "Data from API",
      columns: cols,
    };

    schemaCallback([apiTableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    let tableData = [];
    let i = 0;
    let j = 0;
    let element = document.querySelector("#query");
    let value = element.value;
    if (value=="Mercados") {
        str_value = "mercados/precios-mercados-tiempo-real";
    } else {
        str_value = "demanda/demanda-tiempo-real";
    }
    $.getJSON(
        url = "https://apidatos.ree.es/es/datos/"+str_value+"?start_date=2021-04-27T00:00&end_date=2021-04-27T23:59&time_trunc=hour",
      function (resp) {
        var apiData = resp.included;
        for (i = 0, len = apiData.length; i < len; i++) {
            for (j = 0; j < apiData[i].attributes.values.length; j++) {
                var dic = apiData[i].attributes.values[j];
                tableData.push({
                    datetime: dic.datetime,
                    percentage: dic.percentage,
                    value: Number(dic.value),
                    lastupdatedate: resp.data.attributes["last-update"],
                    type: apiData[i].type,
                    id: apiData[i].id,
                });
            }
        }
        table.appendRows(tableData);
        doneCallback();
      }
    );
  };

  tableau.registerConnector(myConnector);
})();

document.querySelector("#query").addEventListener("change", getData);

/* 
document.querySelector("#trans").addEventListener("click", getData);
document.querySelector("#merca").addEventListener("click", getData); */

/* function getData2() {
    str1 = "mercados/precios-mercados-tiempo-real";
    str2 = "hour";
    tableau.connectionName = "API Tableau";
    tableau.submit();
  }

function getData() {
    str1 = "transporte/energia-no-suministrada-ens";
    str2 = "month";
    tableau.connectionName = "API Tableau";
    tableau.submit();
} */

function getData() {
    url = "https://apidatos.ree.es/es/datos/"+str_value+"?start_date=2021-04-27T00:00&end_date=2021-04-27T23:59&time_trunc=hour";
    tableau.connectionName = "API Tableau";
    tableau.submit();
}