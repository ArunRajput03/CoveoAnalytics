window.localStorage.coveoThings = {};
window.searchData = {};

$(document).ready(function(){
    $("#tr2").hide();
    $("#apiRespinse").hide();
    
    $.ajax({
        url: '/json/accessToken.json',
        dataType: 'json',
        type:'get',
        cache:false,
        success: function(result){
            $(result.accessToken).each(function(i,row){
                $("#CoveoEnv").append($("<option></option>").prop("value",row.value).text(row.env));
            });
        }
    });

    $("#CoveoEnv").click(function(){
        if ($("#CoveoEnv")[0].selectedIndex>0)
        {
            $.when(loadJson()).done(function(ajx1){
                console.log(ajx1);
                $("#tableData tr").remove();
                $("#tr2").show();
                //GetPipeline();
    
                var accessToken = $("#CoveoEnv").val().split('|')[0];
                var hashValue = $("#CoveoEnv").val().split('|')[1];
                var pipeline  = $("#CoveoEnv").val().split('|')[2];
    
                var aqStr = window.searchData.data.aq;
                window.searchData.data.aq = aqStr.replace(/XXXXX/g,hashValue);
            
                var fldStr = window.searchData.data.fieldsToInclude;
                window.searchData.data.fieldsToInclude = fldStr.replace(/XXXXX/g,hashValue).split(',');
    
                fldStr = window.searchData.searchInitiate.fieldsToInclude;
                window.searchData.searchInitiate.fieldsToInclude = fldStr.replace(/XXXXX/g,hashValue).split(',');
                
                window.searchData.searchInitiate.pipeline=pipeline;
                window.searchData.data.pipeline=pipeline;

                window.searchData.analyticsSearches[0].queryPipeline=pipeline;

                window.searchData.accessToken=accessToken;
                OnLoad();
            });
        }
        else
        {
            $("#apiRespinse").hide();
            $("#tr2").hide();
        }
    });

    $(document).on("click", "a[id*='ReadMore']", function(){
        alert($(this).prop("rel"));
    });
});


function loadJson()
{
    return $.ajax({
        url: '/json/SearchPage.json',
        dataType: 'json',
        type:'get',
        cache:false,
        success: function(result){
            window.searchData = result;
        }
    });
}

$(document).ready(function(){
    $("#btnSearch").click(function(){
        window.searchData.data.q = $("#q").val() + "*";
        var pipeline = $("#CoveoEnv").val().split('|')[2];
        window.searchData.data.pipeline = pipeline;

        window.searchData.analyticsSearches.queryText=$("#q").val();

        SearchValues();
    });
});

function SearchValues()
{
    $.ajax({
        url: window.searchData.urls.search,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(window.searchData.data),
        type:'post',
        cache:false,
        headers:{
            'Authorization': 'Bearer ' + window.searchData.accessToken
        },
        /*beforeSend: function (xhr) {
            xhr.setRequestHeader ('Authorization', 'Bearer xxd545438b-818e-4894-9bd3-3ede2598d88b');
        },*/
        success: function(result){
            $("#tableData tr").remove();
            $("#apiRespinse tr").remove();
            if (result.results.length>0){
                var siteUrl = $("#CoveoEnv").val().split('|')[3];

                $("#apiRespinse").show();
                $("#apiRespinse").append("<tr><td>SearchID</td><td>"+result.searchUid+"</td></tr>");
                
                $("#tableData").append("<tr><th>Page Title</th><th>Page Description</th><th>Item Url</th></tr>");
                $(result.results).each(function(i,row){
                    $("#tableData").append("<tr><td><strong>"+(i+1)+"</strong></td><td>"+row.raw[window.searchData.data.fieldsToInclude[0].replace('@','')]+"</td><td><a id=ReadMore"+i+" href='javascript:void(0);' rel='"+ siteUrl + row.raw[window.searchData.data.fieldsToInclude[2].replace('@','')] +"'>Read More</a></td></tr>");
                });
            }
        }
    });
}

function OnLoad() //interfaceLoad
{
    $.ajax({
        url: window.searchData.urls.search,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(window.searchData.searchInitiate),
        type:'post',
        cache:false,
        headers:{
            'Authorization': 'Bearer ' + window.searchData.accessToken
        },
        /*beforeSend: function (xhr) {
            xhr.setRequestHeader ('Authorization', 'Bearer xxd545438b-818e-4894-9bd3-3ede2598d88b');
        },*/
        success: function(result){
            $("#apiRespinse tr").remove();
            $("#apiRespinse").show();
            $("#apiRespinse").append("<tr><td>SearchID</td><td>"+result.searchUid+"</td></tr>");
      debugger;
            window.searchData.searchQueryUid = result.searchUid;
            window.searchData.analyticsSearches[0].searchQueryUid= result.searchUid;
            window.searchData.analyticsSearches[0].numberOfResults=result.totalCount;
            window.searchData.analyticsSearches[0].responseTime=result.requestDuration;

            searchInitiate();   
        }
    });

}

function searchInitiate() //Analytics Call - interfaceLoad
{
    $.ajax({
        url: window.searchData.urls.analyticsSearches,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(window.searchData.analyticsSearches),
        type:'post',
        cache:false,
        headers:{
            'Authorization': 'Bearer ' + window.searchData.accessToken
        },
        /*beforeSend: function (xhr) {
            xhr.setRequestHeader ('Authorization', 'Bearer xxd545438b-818e-4894-9bd3-3ede2598d88b');
        },*/
        success: function(result){
            $("#apiRespinse tr").remove();
            $("#apiRespinse").show();
            $("#apiRespinse").append("<tr><td>SearchID</td><td>"+result.searchUid+"</td></tr>");
            window.searchData.searchQueryUid = result.searchUid;
        }
    });
}

function searchByURL()  //Analytics Call - searchFromLink
{

}

function searchByInputBox() //Analytics Call - searchboxSubmit
{

}

function searchByPaging()   //Analytics Call - search by pagerNumber
{

}

function SearchByPerPageResult()    //Analytics Call - search by PerPage Result
{

}

function clickDocument()    //Analytics Call - document Click
{

}
