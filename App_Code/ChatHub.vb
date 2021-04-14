Imports Microsoft.VisualBasic
Imports Microsoft.AspNet.SignalR
Imports Newtonsoft.Json
Imports Newtonsoft.Json.Linq
Imports System.Web.Script.Serialization
Imports System.Data
Imports System.IO
Imports System.Data.SqlClient
Imports System.Globalization
Imports System.Drawing

    Public Class ChatHub
        Inherits Hub
        Dim DAL As New DAL

        Public Function interns_Insert(
            ByVal Jsonstring As String,
            ByVal actiontype As String 
            ) As String
            BLL.WriteLog("here")
            Dim status As String = "ERROR"
            Dim dc_return As New Dictionary(Of String, Object)
            
            Try
                Dim ds As DataSet = DAL.internsInsert_SignalR(Jsonstring, actiontype)
                Dim dt As DataTable = ds.Tables(0)
                dc_return.Add("RESULT", dt)
                status = "SUCCESS"
            Catch ex As Exception
                BLL.WriteLog(ex.Message + " : " + ex.StackTrace)
            End Try

            dc_return.Add("STATUS", status)
            Clients.All.broadcastMessage(JsonConvert.SerializeObject(dc_return))
        End Function


        Public Function interns_delete(
            ByVal product As String,ByVal email As String,
            ByVal quantity As Integer ,ByVal phoneNumber As String,ByVal comment As String
            ) As DataSet
            BLL.WriteLog("here")
            Dim status As String = "ERROR"
            Dim dc_return As New Dictionary(Of String, Object)
            
            Try
                Dim ds As DataSet = DAL.interns_delete_SignalR(email, phoneNumber)
                Dim dt As DataTable = ds.Tables(0)
                dc_return.Add("RESULT", dt)
                status = "SUCCESS"
            Catch ex As Exception
                BLL.WriteLog(ex.Message + " : " + ex.StackTrace)
            End Try

            dc_return.Add("STATUS", status)
            Clients.All.broadcastMessage(JsonConvert.SerializeObject(dc_return))
        End Function


    Public Function fetchRecords(
        ByVal Jsonstring As String,
        ByVal actiontype As String 
    ) As String
        Dim status As String = "ERROR"
        Dim dc_return As New Dictionary(Of String, Object)
        Try
                Dim ds As DataSet = DAL.fetchRecords(Jsonstring, actiontype)
                Dim dt As DataTable = ds.Tables(0)
                
                dc_return.Add("RESULT", dt)
                status = "SUCCESS"

        
        Catch ex As Exception
            BLL.WriteLog(ex.Message + " : " + ex.StackTrace)
        End Try
        dc_return.Add("STATUS", status)
        Clients.All.broadcastrecords(JsonConvert.SerializeObject(dc_return))
        return JsonConvert.SerializeObject(dc_return)
    End Function

    End Class



