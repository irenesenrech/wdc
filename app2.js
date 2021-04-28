(function () {
    var myConnector = tableau.makeConnector();
  
    myConnector.getSchema = function (schemaCallback) {
      const cols = [
        {
          id: "fecha",
          dataType: tableau.dataTypeEnum.string,
        },
        {
          id: "indicativo",
          dataType: tableau.dataTypeEnum.string,
        },
        {
          id: "nombre",
          dataType: tableau.dataTypeEnum.string,
        },
        {
          id: "provincia",
          dataType: tableau.dataTypeEnum.string,
        },
        {
          id: "altitud",
          dataType: tableau.dataTypeEnum.float,
        },
        {
          id: "tmed",
          dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "tmin",
            dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "horatmin",
            dataType: tableau.dataTypeEnum.string,
        },
        {
            id: "tmax",
            dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "horatmax",
            dataType: tableau.dataTypeEnum.string,
        },
/*         {
            id: "dir",
            dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "velmedia",
            dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "racha",
            dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "horaracha",
            dataType: tableau.dataTypeEnum.string,
        },
        {
            id: "sol",
            dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "presmax",
            dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "horapresmax",
            dataType: tableau.dataTypeEnum.string,
        },
        {
            id: "presmin",
            dataType: tableau.dataTypeEnum.float,
        },
        {
            id: "horapresmin",
            dataType: tableau.dataTypeEnum.string,
        }, */
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
            "https://opendata.aemet.es/opendata/api/valores/climatologicos/diarios/datos/fechaini/2021-04-01T00:00:00UTC/fechafin/2021-04-14T23:59:59UTC/estacion/3194U/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpcmVuZS5zYXJhdmlhQHRoZWluZm9ybWF0aW9ubGFiLmVzIiwianRpIjoiMGFjZjY1MTUtOTgwZS00MWU2LWI3ZDktNmEyNDA5MmVjODhiIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MTk1NjI1NjksInVzZXJJZCI6IjBhY2Y2NTE1LTk4MGUtNDFlNi1iN2Q5LTZhMjQwOTJlYzg4YiIsInJvbGUiOiIifQ.26XpIcH6YlQS8SkxIm-AgAkPelqKGivgc3nFFfZebVg",
            function (resp) {
                var apiArray = resp[0];
                for (i = 0, len = apiArray.length; i < len; i++) {
                    var apiDict = apiArray[i];
                    tableData.push({
                        fecha: apiDict["fecha"],
                        indicativo: apiDict["indicativo"],
                        nombre: apiDict["nombre"],
                        provincia: apiDict["provincia"],
                        altitud: Number(apiDict["altitud"]),
                        tmed: Number(apiDict["tmed"]),
                        tmin: Number(apiDict["tmin"]),
                        horatmin: apiDict["horatmin"],
                        tmax: Number(apiDict["tmax"]),
                        horatmax: apiDict["horatmax"],
                    });
                    table.appendRows(tableData);
                    doneCallback();
                };
            }
        );
    };
    tableau.registerConnector(myConnector);
})();
  
  document.querySelector("#getData").addEventListener("click", getData);
  
  function getData() {
    tableau.connectionName = "API Datos";
    tableau.submit();
  }