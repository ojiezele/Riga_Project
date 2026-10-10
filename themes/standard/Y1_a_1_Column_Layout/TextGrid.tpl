<div class="text-container"
     style="display: flex; flex-direction: column; align-items: center; width: 100%; padding: 0 20px;<%- typeof styleString !== 'undefined' ? ';' + styleString : '' %>">
  <div class="row-content" style="width:100%; <%- typeof contentStyleString !== 'undefined' ? contentStyleString : '' %>">
    <% cells.forEach(function(cell) { %>
      <%- cell %>
    <% }); %>
  </div>
</div>