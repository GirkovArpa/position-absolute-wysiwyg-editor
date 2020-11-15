const TEMPLATE = `<html>

  <head>
    <title>Caption</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        overflow: none;
      }
    </style>
    <script type="text/tiscript">function self.ready() {
  const w = self.intrinsicWidthMax();
  const h = self.intrinsicHeight(w);
  const (sw, sh) = view.screenBox(#frame, #dimension);
  view.move((sw / 2) - (w / 2), (sh / 2) - (h / 2), w, h, false);
  view.windowResizable = false;
}
</script>
  </head>

  <body></body>

</html>`;