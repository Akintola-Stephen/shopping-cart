Imports Microsoft.VisualBasic
Imports Microsoft.ApplicationBlocks.Data
Imports System.Data.SqlClient
Imports System.Data

Public Class DAL
    Dim conn As SqlConnection
    Dim Context As HttpContext = HttpContext.Current
    Public Sub New()
        conn = New SqlConnection(ConnectionString.ConnectionString)

    End Sub

    Public Function internsInsert_SignalR(
        ByVal JSON_STRING As String,
        ByVal ACTION_TYPE As String 
        ) As DataSet
        BLL.WriteLog("here 2")
        Try
            Dim params() As SqlParameter = {New SqlParameter("@JSON_STRING", JSON_STRING),
                                            New SqlParameter("@ACTION_TYPE", ACTION_TYPE)
                                            }
                                            
            ' INSERT_PRODUCT is used to specify the name of the stored procedure
            Return SqlHelper.ExecuteDataset(conn, CommandType.StoredProcedure, "MODULE_PRODUCT", params)
        Catch ex As Exception
            BLL.WriteLog(ex.Message + " : " + ex.StackTrace)
            Return Nothing
        Finally
            conn.Close()
        End Try
    End Function


    Public Function interns_delete_SignalR(
        ByVal email As String,
        ByVal phoneNumber As String
        ) As DataSet
        BLL.WriteLog("delete_SignalR function called")
        Try
              Dim params() As SqlParameter = { 
                                                New SqlParameter("@Email", email),
                                                New SqlParameter("@Mobile", phoneNumber)
                                             }

            Return SqlHelper.ExecuteDataset(conn, CommandType.StoredProcedure, "DELETE_PRODUCT", params)
        
        Catch ex As Exception
            BLL.WriteLog(ex.Message + " : " + ex.StackTrace)
            Return Nothing
        Finally
            conn.Close()
        End Try
    End Function

    
    Public Function fetchRecords(
        ByVal JSON_STRING As String,
        ByVal ACTION_TYPE As String 
    ) As DataSet
        Try
        Dim params() As SqlParameter = {
                                        New SqlParameter("@JSON_STRING", JSON_STRING),
                                        New SqlParameter("ACTION_TYPE", ACTION_TYPE)
                                       }
            Return SqlHelper.ExecuteDataset(conn, CommandType.StoredProcedure, "MODULE_PRODUCT", params)
        Catch ex As Exception
            BLL.WriteLog(ex.Message + " : " + ex.StackTrace)
            Return Nothing
        Finally
            conn.Close()
        End Try
    End Function
End Class
