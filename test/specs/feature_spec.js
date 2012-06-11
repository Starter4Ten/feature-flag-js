describe('Feature flag api', function () {

        beforeEach(function () {
            //Registers and turns on/off feature
            feature('feature1').turnOn();
            feature('feature2').turnOn();
            feature('feature3').turnOff();
            feature('all').turnOff();
        });

        it('should return feature active for feature1', function () {
            expect(feature('feature1').isOn()).toBeTruthy();
        });

        it('should return feature disabled for feature3', function () {
            expect(feature('feature3').isOn()).toBeFalsy();
        });

        it('should active feature with turn on', function () {
            expect(feature('feature3').isOn()).toBeFalsy();
            feature('feature3').turnOn();
            expect(feature('feature3').isOn()).toBeTruthy();
            feature('feature3').turnOff();
        });

        it('should disable feature with turn off', function () {
            expect(feature('feature2').isOn()).toBeTruthy();
            feature('feature2').turnOff();
            expect(feature('feature2').isOn()).toBeFalsy();
            feature('feature2').turnOn();
        });

        it('should execute the provided named function for feature1', function () {
            var functionCount = 0,
                featureProtectedFunction = function () {
                    functionCount++;
                };
            feature('feature1').whenOn(featureProtectedFunction);
            expect(functionCount).toEqual(1);
        });

        it('should not execute the provided named function for feature3', function () {
            var functionCount = 0,
                featureProtectedFunction = function () {
                    functionCount++;
                };
            feature('feature3').whenOn(featureProtectedFunction);
            expect(functionCount).toEqual(0);
        });

        it('should execute the anonymous function for feature1', function () {
            var functionCount = 0;
            feature('feature1').whenOn(function () {
                functionCount++;
            });
            expect(functionCount).toEqual(1);
        });

        it('should not execute the anonymous function for feature3', function () {
            var functionCount = 0;
            feature('feature3').whenOn(function () {
                functionCount++;
            });
            expect(functionCount).toEqual(0);
        });

        it('should execute the provided named function for feature3 when turned off', function () {
            var functionCount = 0,
                featureProtectedFunction = function () {
                    functionCount++;
                };
            feature('feature3').whenOff(featureProtectedFunction);
            expect(functionCount).toEqual(1);
        });

        it('should execute the anonymous function for feature3 when turned off', function () {
            var functionCount = 0;
            feature('feature3').whenOff(function () {
                functionCount++;
            });
            expect(functionCount).toEqual(1);
        });

        it('should execute the whenOn anonymous function for feature1 and not the else', function () {
            var functionCount = 0;
            feature('feature1').whenOnElse(function () {
                functionCount++;
            }, function () {
                functionCount--;
            });
            expect(functionCount).toEqual(1);
        });

        it('should execute the Else anonymous function for feature3 and not the whenOn', function () {
            var functionCount = 0;
            feature('feature3').whenOnElse(function () {
                functionCount++;
            }, function () {
                functionCount--;
            });
            expect(functionCount).toEqual(-1);
        });
        
        it('should always return is on for all features when feature "all" turned on', function () {
            expect(feature('feature1').isOn()).toBeTruthy();
            expect(feature('feature2').isOn()).toBeTruthy();
            expect(feature('feature3').isOn()).toBeFalsy();
            feature('all').turnOn();
            expect(feature('feature1').isOn()).toBeTruthy();
            expect(feature('feature2').isOn()).toBeTruthy();
            expect(feature('feature3').isOn()).toBeTruthy();
        });
        
        it('should always return is on for all features when feature "all" turned on except for excluded feature3', function () {
            expect(feature('feature1').isOn()).toBeTruthy();
            expect(feature('feature2').isOn()).toBeTruthy();
            expect(feature('feature3').isOn()).toBeFalsy();
            feature('all').turnOn().exclude(['feature3']);
            expect(feature('feature1').isOn()).toBeTruthy();
            expect(feature('feature2').isOn()).toBeTruthy();
            expect(feature('feature3').isOn()).toBeFalsy();
        });
    });