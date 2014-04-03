App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Router.reopen({
  enableLogging: true
});

App.Router.map(function(){
  this.resource("slides");
});

App.ApplicationRoute = Em.Route.extend({
  redirect: function(){
    this.transitionTo("slides");
  }
})

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
    return Em.$.get("/slides.json").then(function(response){
      var slides = Em.A();
      response.forEach(function(child){
        var slide = App.Slide.create({
          location: child.location,
          id: child.id
        });
        slides.pushObject(slide);
      });
      return slides;
    });
  }
});

App.SlidesRoute = Em.Route.extend({
  model: function(){
    return App.Slide.findAll().then(function(slides){
      return slides[0];
    });
  },
  afterModel: function(model){
    return model.loadMarkdown().then(function(){
      return model;
    });
  }
});
