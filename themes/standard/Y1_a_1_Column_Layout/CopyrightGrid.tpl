<div class="container py-4" style="<%- typeof styleString !== 'undefined' ? styleString : '' %>">
  <div class="container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; text-align: center;">
    <div style="width: 100%; text-align: center; margin: 0 auto; <%- typeof contentStyleString !== 'undefined' ? contentStyleString : '' %>">
      <% cells.forEach(function(cell) { %>
        <%- cell %>
      <% }); %>
    </div>
  </div>
</div>