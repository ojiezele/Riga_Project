<ul class="riga-list-group space-y-2.5 p-0 m-0 list-none">
 <% items.forEach(function(item) { %>
 <li class="flex items-center gap-2.5 text-xs text-gray-800 font-semibold" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
   <span class="riga-list-bullet" style="width: 22px; height: 22px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">✓</span>
   <span style="font-size: 13px; color: #1f2937;"><%= item %></span>
 </li>
 <% }); %>
</ul>