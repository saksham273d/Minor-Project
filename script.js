document.addEventListener("DOMContentLoaded", function() {
    var issues = [];
    var form = document.querySelector("#exception-form");
    var tablebody = document.querySelector("#exceptions-table-body");
    var filterIssue = document.querySelector("#filter-issue");
    var filterStatus = document.querySelector("#filter-status");
    var openCountE1 = document.querySelector("#open-count");
    var resolvedCountE1 = document.querySelector("#resolved-count");

    function getSelectedPriority(){
        var radios = document.querySelectorAll('input[name="priority"]');
        for(var i = 0; i < radios.length; i++){
            if(radios[i].checked){
                return radios[i].value;
            }
        }
        return "";
    }

    function resetform(){
        form.reset();
    }

    function updateCounters(){
        var openCount = 0;
        var resolvedCount = 0;
        for(var i = 0; i < issues.length; i++){
            if(issues[i].status === "open"){
                openCount++;
            } else {
                resolvedCount++;
            }
        }
        openCountE1.textContent = openCount;
        resolvedCountE1.textContent = resolvedCount;
    }

    function createIssueRow(issue , index){
        var row = document.createElement("tr");
        row.setAttribute("data-index", index);
        if(issue.priority === "high"){
            row.classList.add("row-high");
        }
        if(issue.status === "resolved"){
            row.classList.add("row-resolved");
        }

        var Delivery = document.createElement("td");
        Delivery.textContent = issue.title;
        row.appendChild(Delivery);

        var Customer = document.createElement("td");
        Customer.textContent = issue.description;
        row.appendChild(Customer);

        var Issue = document.createElement("td");
        Issue.textContent = issue.type;
        row.appendChild(Issue);

        var Priority = document.createElement("td");
        Priority.textContent = issue.priority;
        Priority.classList.add(issue.priority === "high" ? "priority-high" : issue.priority === "medium" ? "priority-medium" : "priority-low");
        row.appendChild(Priority);

        var Status = document.createElement("td");
        var span = document.createElement("span");
        span.textContent = issue.status;
        span.classList.add("status-badge" , issue.status === "open" ? "status-open" : "status-resolved");
        Status.appendChild(span);
        row.appendChild(Status);

        var Action = document.createElement("td");
        var Resolve = document.createElement("button");
        Resolve.textContent = "Resolve";
        Resolve.classList.add("btn" , "resolve");
        Resolve.setAttribute("data-action", "resolve");
        Resolve.setAttribute("data-index", index);
        if(issue.status === "resolved"){
            Resolve.disabled = true;
        }
        Action.appendChild(Resolve);

        var Delete = document.createElement("button");
        Delete.textContent = "Delete";
        Delete.classList.add("btn" , "delete");
        Delete.setAttribute("data-action", "delete");
        Delete.setAttribute("data-index", index);
        Delete.style.marginLeft = "8px";
        Action.appendChild(Delete);
        row.appendChild(Action);
        applyFiltersToRow(row , issue);
        return row;
    }

    function renderTable(){
        tablebody.innerHTML = "";
        for(var i = 0; i < issues.length; i++){
            var row = createIssueRow(issues[i] , i);
            tablebody.appendChild(row);
        }
        updateCounters();
    }

    function applyFiltersToRow(row , issue){
        var issueFilter = filterIssue.value;
        var statusFilter = filterStatus.value;
        var matchesIssue = issueFilter === "All" || issue.type === issueFilter;
        var matchesStatus = statusFilter === "All" || issue.status === statusFilter.toLowerCase();
        if(matchesIssue && matchesStatus){
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }

    form.addEventListener("submit" , function(e){
        e.preventDefault();
        var Deliveryinput = document.querySelector("#delivery-id");
        var Customerinput = document.querySelector("#customer-name");
        var Issuetype = document.querySelector("#issue-type");
        var notesinput = document.querySelector("#notes");
        var Priority = getSelectedPriority();

        var Delivery = Deliveryinput.value.trim();
        var Customer = Customerinput.value.trim();
        var Issue = Issuetype.value.trim();
        var Notes = notesinput.value.trim();

        if(Delivery === "" || Customer === "" || Issue === "" || Priority === ""){
            alert("Please fill in all required fields.");
            return;
        }
        var newIssue = {
            title: Delivery,
            description: Customer,
            type: Issue,
            priority: Priority,
            notes: Notes,
            status: "open"
        };
        issues.push(newIssue);
        renderTable();
        resetform();
    });

    filterIssue.addEventListener("change" , function(){
        for(var i = 0; i < issues.length; i++){
            var row = document.querySelector("tr[data-index='" + i + "']");
            if(row){
                applyFiltersToRow(row , issues[i]);
            }
        }        
        renderTable();
    });

    filterStatus.addEventListener("change" , function(){
        for(var i = 0; i < issues.length; i++){
            var row = document.querySelector("tr[data-index='" + i + "']");
            if(row){
                applyFiltersToRow(row , issues[i]);
            }
        }
        renderTable();
    });

    document.addEventListener("click" , function(event){
        var target = event.target;
        if(target.tagName.toLowerCase() !== "button"){
            return;
        }
        var action = target.getAttribute("data-action");
        var row = target.closest("tr");
        if(!row || !action){
            return;
        }
        var index = parseInt(target.getAttribute("data-index") , 10);
        var issue = issues[index];
        if(action === "resolve"){
            if(issue.status === "resolved"){
                return;
            }
            issue.status = "resolved";

            var statusCell = row.querySelector("td:nth-child(5) .status-badge");
            statusCell.textContent = "resolved";
            statusCell.classList.remove("status-open");
            statusCell.classList.add("status-resolved");

            row.classList.add("row-resolved");

            target.classList.add("btn-disabled");
            target.disabled = true;
            applyFiltersToRow(row , issue);
            updateCounters();
        } else if(action === "delete"){
            var confirmDelete = confirm("Are you sure you want to delete this issue?");
            if(!confirmDelete){
                return;
            }
            issues.splice(index , 1);
            renderTable();
        }
    });
});