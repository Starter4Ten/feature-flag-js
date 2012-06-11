var feature = (function() {  
    var FeatureModel = Backbone.Model.extend({

        isOn: function () {

            //All is a special case feature. If it is on then always return true for the feature,
            if (this.collection.get('all') && this.collection.get('all').get('active')) {
                var allExcludeList = this.collection.get('all').excludeList;
                if (allExcludeList && _.indexOf(allExcludeList, this.id) > -1) { return this.get('active'); }
                return true;
            }

            return this.get('active');
        },

        whenOn: function (toExecute, context) {
            if (this.isOn() === true) { return toExecute.apply(context || this); }
        },

        whenOff: function (toExecute, context) {
            if (this.isOn() === false) { return toExecute.apply(context || this); }
        },

        whenOnElse: function (toExecuteIfOn, toExecuteIfOff, context) {
            if (this.isOn() === true) {
                return toExecuteIfOn.apply(context || this);
            } else {
                return toExecuteIfOff.apply(context || this);
            }
        },

        turnOn: function () {
            this.set('active', true);
            return this;
        },

        turnOff: function () {
            this.set('active', false);
            return this;
        },

        exclude: function (featureId) {
            if (this.id !== 'all') {
                //Only the all feature can have exclude at this stage
                return;
            }
            if (!this.excludeList) {
                this.excludeList = [];
            }
            if (_.isArray(featureId)) {
                this.excludeList = _.union(featureId, this.excludeList);
            } else if (_.isString(featureId)) {
                this.excludeList.push(featureId);
            }
        }
    });

    var FeatureConfiguration = Backbone.Collection.extend({
        model: FeatureModel
    });

    var features = new FeatureConfiguration();

    var feature = function (featureId) {
        var model = features.get(featureId);
        if (model) {
            return features.get(featureId);
        } else {
            model = new FeatureModel({
                id: featureId,
                active: false
            });
            features.add(model);
            return model;
        }
    };

    return feature;
})();
    