Imports Microsoft.VisualBasic

Public Class ConnectionString
    Public Shared Function ConnectionString() As String
        Dim myConnection As String = System.Configuration.ConfigurationManager.ConnectionStrings("app_ConnectionString").ConnectionString
        Return myConnection
    End Function
End Class
