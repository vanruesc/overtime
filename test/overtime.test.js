describe("Overtime", function() {

	describe("Sanity checks", function() {

		var overtime;

		it("is a constructor function", function() {

			assert(typeof Overtime === "function");

		});

		it("is instancable", function() {

			overtime = new Overtime();
			assert(typeof overtime === "object");

		});

		it("should provide a static TimeMeasure enumeration", function() {

			assert(typeof Overtime.TimeMeasure === "object");

		});

	});

	describe("Functionality", function() {

		var overtime;

		before(function() {

			overtime = new Overtime({
				timeMeasure: Overtime.TimeMeasure.SECONDS,
				time: 5
			});

		});

		it("renders the progressing time without errors", function() {

      document.getElementById("mocha").appendChild(overtime.canvas);
      overtime.start();

		});

		it("can be stopped", function() {

      overtime.stop();

		});

		it("emits an elapsed event", function(done) {

      overtime.addEventListener("elapsed", function() {

				done();

			});

			overtime.timeMeasure = Overtime.TimeMeasure.MILLISECONDS;
			overtime.time = 1;
      overtime.start();

		});

	});

});
