var gattApp = angular.module("gattApp");

gattApp.controller("gattController", ["$scope", "$http", "$compile", function($scope, $http, $compile) {

    //Function taken from the following source: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    String.prototype.hashCode = function() {
        var hash = 0;
        if (this.length == 0) return hash;
        for (i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    this.services = [{
        id: 1,
        characteristics: [{
            id: 1
        }]
    }];

    this.description = ""

    this.addService = function() {
        var newNumber = this.services.length + 1;
        this.services.push({
            "id": newNumber,
            "characteristics": [{
                "id": 1
            }]
        });
    };

    this.removeService = function(id) {
        this.services.splice(id - 1);
    };

    this.addCharacteristic = function(id) {
        var newNumber = this.services[id - 1].characteristics.length + 1;
        this.services[id - 1].characteristics.push({
            "id": newNumber
        });
    };

    this.removeCharacteristic = function(idService, idChar) {
        this.services[idService - 1].characteristics.splice(idChar - 1);
    };

    this.submit = function() {
        var serviceLength = this.services.length;

        this.content = {
            gatthash: "placeholder"
        };


        this.content.services = []
        this.uuids = "";

        //same flaw in hash function here    
        for (var i = 0; i < serviceLength; i++) {
            var charLength = this.services[i].characteristics.length
            var service = {
                uuid: this.services[i].uuid,
                name: this.services[i].name,
                characteristics: []
            }
            this.uuids += this.services[i].uuid;
            this.content.services.push(service)
            for (var j = 0; j < charLength; j++) {
                var characteristic = {
                    uuid: this.services[i].characteristics[j].uuid,
                    name: this.services[i].characteristics[j].name,
                    format: this.services[i].characteristics[j].format,
                    access: this.services[i].characteristics[j].access
                }
                this.uuids += this.services[i].characteristics[j].uuid;
                this.content.services[i].characteristics.push(characteristic);
            }
        }

        this.content.gatthash = this.uuids.hashCode();


        console.log("Sending request to <api_url>/" + this.content.gatthash + ".json");


        var data = {
            "message": this.description,
            "content": btoa(JSON.stringify(this.content))
        };

        var auth = {
            "Authorization": "Basic R2F0dEV4cGxvcmVyQm90OjQ3MDk4ZWYxNGZkNDhhYzY1OThjNjI5YTU0NTNlNTMyMWVlZDMyMjI="
        };

        $http.put("https://api.github.com/repos/akdeniza/gatt-explorer-database/contents/data/" + this.content.gatthash + ".json",
                data, {
                    headers: auth
                })
            .then(function(data) {
                console.log(data);
            });

    };
}]);
