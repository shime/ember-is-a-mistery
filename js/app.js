App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Router.reopen({
  enableLogging: true
});

App.Router.map(function(){
  this.resource("slides", {path: "slides/:id"});
});


App.Converter = new Markdown.Converter();

App.Slide = Ember.Object.extend({
  loadMarkdown: function(){
    var self = this;
    return Em.$.get(self.get("location")).then(function(response){
      self.set("content", App.Converter.makeHtml(response));
      return response;
    });
  }
});

App.Slide.reopenClass({
  findAll: function(){
    var self = this;
    if (this.slides) {
      return new Em.RSVP.Promise(function(resolve, reject){
        resolve(self.slides);
      });
    } else {
      return Em.$.get("/slides.json").then(function(response){
        var slides = Em.A();
        response.forEach(function(child){
          var slide = App.Slide.create({
            location: child.location,
              id: child.id
          });
          slides.pushObject(slide);
        });
        self.slides = slides;
        return slides;
      });
    }
  },
  find: function(id){
    return App.Slide.findAll().then(function(slides){
      return slides.findBy("id", id);
    });
  }
});

App.ApplicationRoute = Em.Route.extend({
  activate: function(){
    console.log("inside application");
  }
})

App.IndexRoute = Em.Route.extend({
  redirect: function(){
    console.log("inside index");
    this.transitionTo("slides", 1);
  }
})

App.SlidesRoute = Em.Route.extend({
  model: function(params){
    var id = parseInt(params.id);
    return App.Slide.find(id);
  },
  afterModel: function(model){
    return model.loadMarkdown().then(function(){
      return model;
    });
  },
  actions: {
    switchSlide: function(direction){
      var id = parseInt(this.get("controller.model.id"));
      if (direction == "left"){
        this.transitionTo("slides", App.Slide.find(id - 1));
      }
      if (direction == "right"){
        this.transitionTo("slides", App.Slide.find(id + 1));
      }
    }
  }
});

App.SlidesView = Em.View.extend({
  didInsertElement: function(){
    this.$("body").focus();
  },
  keyDown: function(event){
    var direction = {
      37: "left",
      39: "right"
    };
    this.get("controller").send("switchSlide", direction[event.keyCode]);
  }
});
