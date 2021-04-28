var parameter = "trans";
var time = "month";
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
    var i = 0;
    var j = 0;
    $.getJSON(
      `https://apidatos.ree.es/es/datos/${trans}?start_date=2020-04-27T00:00&end_date=2021-04-27T23:59&time_trunc=` + time,
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

document.querySelector("#trans").addEventListener("click", makeSth("trans"));
document.querySelector("#merca").addEventListener("click", makeSth("merca"));

function makeSth (param) {
    if (param == "trans") {
        parameter = "transporte/energia-no-suministrada-ens";
        time = "month";
    } else {
        parameter = "mercados/precios-mercados-tiempo-real";
        time = "hour";
    }
    getData();
}

function getData() {
    tableau.connectionName = "API Datos";
    tableau.submit();
}