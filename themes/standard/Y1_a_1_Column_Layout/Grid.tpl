<div class="container" style="display: flex; padding-top:15px; padding-bottom:15px; <%- typeof styleString !== 'undefined' ? styleString : '' %>">
  <div class="row-content" style="width:100%; <%- typeof contentStyleString !== 'undefined' ? contentStyleString : '' %>">
    <% cells.forEach(function(cell) { %>
      <%- cell %>
    <% }); %>
  </div>
</div>